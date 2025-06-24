'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Save, Trash2, ImagePlus, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useSupabase } from '@/providers/SupabaseProvider';
import type { User } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { TextAreaWithPreview } from '@/components/TextAreaWithPreview';

type FieldType = 'text' | 'email' | 'number' | 'phone' | 'date' | 'select' | 'checkbox' | 'radio' | 'textarea';

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormSection {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}


const NewEvent = () => {
  const router = useRouter();
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Erro ao buscar sessão:', error);
        return;
      }
      setUser(session?.user ?? null);
    };

    getUser();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#7c3aed');
  const [accentColor, setAccentColor] = useState('#c4b5fd');
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  
  const [sections, setSections] = useState<FormSection[]>([
    {
      id: '1',
      title: 'Informações Pessoais',
      description: 'Preencha seus dados para confirmação de presença',
      fields: [
        { id: '1', type: 'text', label: 'Nome Completo', placeholder: 'Digite seu nome', required: true },
        { id: '2', type: 'email', label: 'Email', placeholder: 'Digite seu email', required: true },
        { id: '3', type: 'phone', label: 'Telefone', placeholder: 'Digite seu telefone', required: false },
      ]
    }
  ]);
  
  const [availableFields] = useState<{type: FieldType, label: string, icon: string}[]>([
    { type: 'text', label: 'Texto', icon: 'Aa' },
    { type: 'email', label: 'Email', icon: '@' },
    { type: 'number', label: 'Número', icon: '#' },
    { type: 'phone', label: 'Telefone', icon: '📱' },
    { type: 'date', label: 'Data', icon: '📅' },
    { type: 'select', label: 'Seleção', icon: '☑' },
    { type: 'checkbox', label: 'Checkbox', icon: '✓' },
    { type: 'radio', label: 'Opções', icon: '◉' },
    { type: 'textarea', label: 'Área de Texto', icon: '¶' },
  ]);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBackgroundFile(file);
      setBackgroundPreview(URL.createObjectURL(file));
    }
  };

  const addNewField = (sectionId: string, type: FieldType) => {
    setSections(prevSections => 
      prevSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: [
              ...section.fields,
              {
                id: `field-${Date.now()}`,
                type,
                label: `Novo campo ${type}`,
                placeholder: '',
                required: false,
                options: (type === 'select' || type === 'radio' || type === 'checkbox') ? ['Opção 1'] : undefined
              }
            ]
          };
        }
        return section;
      })
    );
  };

  const removeField = (sectionId: string, fieldId: string) => {
    setSections(prevSections => 
      prevSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: section.fields.filter(field => field.id !== fieldId)
          };
        }
        return section;
      })
    );
  };

  const updateField = (sectionId: string, fieldId: string, updates: Partial<FormField>) => {
    setSections(prevSections => 
      prevSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: section.fields.map(field => 
              field.id === fieldId ? { ...field, ...updates } : field
            )
          };
        }
        return section;
      })
    );
  };

  const addNewSection = () => {
    const newSection: FormSection = {
      id: `section-${Date.now()}`,
      title: 'Nova Seção',
      description: 'Descrição da nova seção',
      fields: []
    };
    
    setSections([...sections, newSection]);
  };

  const removeSection = (sectionId: string) => {
    setSections(prevSections => prevSections.filter(section => section.id !== sectionId));
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const updateFieldOptions = (sectionId: string, fieldId: string, options: string[]) => {
    setSections(prevSections =>
      prevSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: section.fields.map(field =>
              field.id === fieldId ? { ...field, options } : field
            )
          };
        }
        return section;
      })
    );
  };

  const renderFieldEditor = (sectionId: string, field: FormField) => {
    return (
      <div key={field.id} className="bg-muted/50 p-4 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <Input
            value={field.label}
            onChange={(e) => updateField(sectionId, field.id, { label: e.target.value })}
            className="font-medium"
            placeholder="Nome do campo"
          />
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8 ml-2"
            onClick={() => removeField(sectionId, field.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            value={field.placeholder || ''}
            onChange={(e) => updateField(sectionId, field.id, { placeholder: e.target.value })}
            placeholder="Placeholder do campo"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField(sectionId, field.id, { required: e.target.checked })}
              className="rounded border-input"
            />
            <span className="text-sm">Campo obrigatório</span>
          </div>
        </div>

        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Opções</label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])];
                      newOptions[index] = e.target.value;
                      updateFieldOptions(sectionId, field.id, newOptions);
                    }}
                    placeholder={`Opção ${index + 1}`}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      const newOptions = field.options?.filter((_, i) => i !== index) || [];
                      updateFieldOptions(sectionId, field.id, newOptions);
                    }}
                  >
                    <Minus size={16} />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = [...(field.options || []), ''];
                  updateFieldOptions(sectionId, field.id, newOptions);
                }}
              >
                <Plus size={16} className="mr-2" />
                Adicionar opção
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const saveEvent = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para criar um evento');
      router.push('/login');
      return;
    }
    
    setLoading(true);
    
    try {
      // Upload de arquivos
      let backgroundUrl = null;
      
      
      if (backgroundFile) {
        const fileExt = backgroundFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        
        // Upload do arquivo
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('flyer-bucket')
          .upload(`public/${fileName}`, backgroundFile, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          console.error('Erro de upload:', uploadError);
          throw new Error('Erro ao fazer upload da imagem de fundo');
        }
        
        // Obter URL pública
        const { data } = await supabase.storage
          .from('flyer-bucket')
          .getPublicUrl(`public/${fileName}`);
        
        if (!data.publicUrl) {
          throw new Error('Erro ao obter URL pública da imagem');
        }
        
        backgroundUrl = data.publicUrl;
      }
      
      // Criar evento
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: eventTitle,
          description: eventDescription,
          primaryColor,
          accentColor,
          backgroundImageUrl: backgroundUrl,
          eventDate: new Date().toISOString(),
          userId: user.id, // Adicionando o userId explicitamente
          sections: sections.map((section, sectionIndex) => ({
            title: section.title,
            description: section.description,
            orderIndex: sectionIndex,
            fields: section.fields.map((field, fieldIndex) => ({
              type: field.type,
              label: field.label,
              placeholder: field.placeholder,
              required: field.required,
              options: field.options ? JSON.stringify(field.options) : null, // Garantindo que options seja uma string JSON
              orderIndex: fieldIndex,
            }))
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar evento');
      }

      const event = await response.json();
      
      toast.success('Evento criado com sucesso!');
      router.push(`/events/${event.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-4">Informações Básicas</h2>
              <p className="text-muted-foreground mb-6">Preencha as informações principais do seu evento</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="eventTitle" className="block text-sm font-medium mb-1">
                  Nome do Evento
                </label>
                <Input 
                  id="eventTitle" 
                  value={eventTitle} 
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Ex: Aniversário de 30 anos" 
                />
              </div>
              
              <div>
                <label htmlFor="eventDescription" className="block text-sm font-medium mb-1">
                  Descrição do Evento
                </label>
                <TextAreaWithPreview 
                  id="eventDescription"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e)}
                  placeholder="Descreva seu evento em poucas palavras..."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 pt-4">
                <div>
                  <label htmlFor="background" className="block text-sm font-medium mb-2">
                    Flyer do Evento
                  </label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    {backgroundPreview ? (
                      <div className="relative w-full">
                        <img 
                          src={backgroundPreview} 
                          alt="Background preview" 
                          className="w-full h-40 object-cover rounded" 
                        />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setBackgroundFile(null);
                            setBackgroundPreview(null);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Clique para fazer upload da imagem antes do form (cuidado ela terá o tamanho original)
                        </p>
                        <Input 
                          id="background" 
                          type="file" 
                          accept="image/*"
                          onChange={handleBackgroundChange}
                          className="hidden"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => document.getElementById('background')?.click()}
                          className="mt-2"
                        >
                          Selecionar arquivo
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                          Imagens pesadas podem demorar para carregar, então não esqueça de otimizar as imagens antes de fazer o upload.
                        </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-4">Personalização</h2>
              <p className="text-muted-foreground mb-6">Defina o estilo visual do seu formulário</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium mb-1">
                  Cor Principal
                </label>
                <div className="flex items-center gap-3">
                  <div 
                    className="h-8 w-8 rounded-full border"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <Input 
                    id="primaryColor" 
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-16 h-8 p-0"
                  />
                  <Input 
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="accentColor" className="block text-sm font-medium mb-1">
                  Cor de Destaque
                </label>
                <div className="flex items-center gap-3">
                  <div 
                    className="h-8 w-8 rounded-full border"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <Input 
                    id="accentColor" 
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-16 h-8 p-0"
                  />
                  <Input 
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium mb-1">
                Pré-visualização
              </label>
              <div className="border rounded-xl p-6 bg-card">
                <div style={{
                  backgroundColor: primaryColor,
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  backgroundImage: backgroundPreview ? `url(${backgroundPreview})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {backgroundPreview && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: `${primaryColor}CC`,
                      backdropFilter: 'blur(2px)',
                    }} />
                  )}
                  
                  <div className="relative z-10 flex items-center gap-2">
                    {backgroundPreview && (
                      <img 
                        src={backgroundPreview} 
                        alt="Logo" 
                        className="h-8 w-8 object-contain" 
                      />
                    )}
                    <h3 className="font-medium">{eventTitle || "Nome do Evento"}</h3>
                  </div>
                </div>
                
                <div style={{
                  borderLeft: `4px solid ${accentColor}`,
                  paddingLeft: '1rem',
                }}>
                  <p>{eventDescription || "Descrição do evento"}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-4">Estrutura do Formulário</h2>
              <p className="text-muted-foreground mb-6">Crie as seções e campos do seu formulário</p>
            </div>
            
            <div className="space-y-8">
              {sections.map((section) => (
                <div key={section.id} className="border rounded-lg p-6">
                  <div className="mb-6 flex justify-between">
                    <div className="w-full">
                      <Input 
                        value={section.title}
                        onChange={(e) => {
                          setSections(sections.map(s => 
                            s.id === section.id ? {...s, title: e.target.value} : s
                          ));
                        }}
                        className="text-xl font-semibold mb-2"
                        placeholder="Título da Seção"
                      />
                      <Textarea 
                        value={section.description || ''}
                        onChange={(e) => {
                          setSections(sections.map(s => 
                            s.id === section.id ? {...s, description: e.target.value} : s
                          ));
                        }}
                        className="text-sm text-muted-foreground"
                        placeholder="Descrição da seção (opcional)"
                      />
                    </div>
                    {sections.length > 1 && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 ml-2"
                        onClick={() => removeSection(section.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                      {section.fields.map((field) => (
                        <div key={field.id} className="bg-muted/50 p-4 rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <Input 
                              value={field.label}
                              onChange={(e) => updateField(section.id, field.id, { label: e.target.value })}
                              className="font-medium flex-1"
                              placeholder="Nome do campo"
                            />
                            <div className="flex items-center ml-2">
                              <div className="text-sm text-muted-foreground mr-2">{field.type}</div>
                              <div className="flex items-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateField(section.id, field.id, { required: !field.required })}
                                >
                                  {field.required ? (
                                    <span title="Campo obrigatório">*</span>
                                  ) : (
                                    <span title="Campo opcional" className="text-muted-foreground">○</span>
                                  )}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => removeField(section.id, field.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <Input 
                            value={field.placeholder || ''}
                            onChange={(e) => updateField(section.id, field.id, { placeholder: e.target.value })}
                            placeholder="Placeholder do campo (opcional)"
                            className="mb-2"
                          />
                          
                          {/* Adicionar editor de opções para campos select, radio e checkbox */}
                          {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                            <div className="mt-4 space-y-2">
                              <label className="text-sm font-medium">Opções do Campo</label>
                              <div className="space-y-2">
                                {field.options?.map((option, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <Input
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...(field.options || [])];
                                        newOptions[index] = e.target.value;
                                        updateField(section.id, field.id, { options: newOptions });
                                      }}
                                      placeholder={`Opção ${index + 1}`}
                                      className="flex-1"
                                    />
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => {
                                        const newOptions = field.options?.filter((_, i) => i !== index);
                                        updateField(section.id, field.id, { options: newOptions });
                                      }}
                                    >
                                      <Minus size={16} />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => {
                                    const newOptions = [...(field.options || []), `Opção ${(field.options?.length || 0) + 1}`];
                                    updateField(section.id, field.id, { options: newOptions });
                                  }}
                                >
                                  <Plus size={16} className="mr-2" />
                                  Adicionar Opção
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-muted-foreground">
                              {field.required ? 'Campo obrigatório' : 'Campo opcional'}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  <div className="mt-6 border-t pt-6">
                    <p className="mb-3 text-sm">Adicionar campo:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableFields.map((fieldType) => (
                        <Button
                          key={fieldType.type}
                          variant="outline"
                          size="sm"
                          onClick={() => addNewField(section.id, fieldType.type)}
                        >
                          <span className="mr-1">{fieldType.icon}</span> {fieldType.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              <Button onClick={addNewSection} variant="outline" className="w-full py-6">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Nova Seção
              </Button>
            </div>
          </motion.div>
        );
        
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-4">Finalização</h2>
              <p className="text-muted-foreground mb-6">Revise as informações e salve seu evento</p>
            </div>
            
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold mb-2">Detalhes do Evento</h3>
              <p className="text-muted-foreground mb-4">
                Confira se todas as informações estão corretas antes de prosseguir
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Nome do Evento</h4>
                  <p className="font-medium">{eventTitle || "Sem título"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Descrição</h4>
                  <p>{eventDescription || "Sem descrição"}</p>
                </div>
                
                <div className="flex gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Cores</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div 
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: primaryColor }}
                      ></div>
                      <div 
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Imagens</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center">
                        <span className="text-sm">Fundo: </span>
                        <span className="ml-1">{backgroundFile ? '✅' : '❌'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Estrutura do Formulário</h4>
                  <p>{sections.length} seções, {sections.reduce((total, section) => total + section.fields.length, 0)} campos</p>
                  
                  <div className="mt-2">
                    {sections.map((section, index) => (
                      <div key={section.id} className="pl-3 border-l-2 border-muted-foreground/20 mb-2">
                        <p className="font-medium">{index + 1}. {section.title}</p>
                        <ul className="pl-4 text-sm text-muted-foreground">
                          {section.fields.map((field, fieldIndex) => (
                            <li key={field.id}>{fieldIndex + 1}. {field.label} ({field.type})</li>
                          ))}
                          {section.fields.length === 0 && (
                            <li className="italic">Nenhum campo</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Criar Novo Evento</h1>
        </div>
        
        <div className="bg-card border rounded-xl p-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {['Informações', 'Personalização', 'Campos', 'Finalizar'].map((label, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                      step > i + 1 
                        ? 'bg-primary text-primary-foreground' 
                        : step === i + 1 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
            
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Content */}
          <div className="min-h-[400px]">
            {renderStep()}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={step === 1 && !eventTitle}
              >
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={saveEvent}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Evento
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
      

    </div>
  );
};

export default NewEvent;
