'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface FormField {
  id: string;
  type: string;
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

interface Event {
  id: string;
  title: string;
  description: string;
  primary_color: string;
  accent_color: string;
  background_image_url?: string;
  sections: FormSection[];
}

export default function EventForm() {
  const { eventId } = useParams();
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}`);
      if (!response.ok) throw new Error('Erro ao carregar evento');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Evento não encontrado</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/events/${eventId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar formulário');
      }

      const data = await response.json();
      toast.success('Formulário enviado com sucesso!');
      
      // Redireciona para a página de agradecimento com as cores do evento
      window.location.href = `/events/${eventId}/form/thank-you?primary=${encodeURIComponent(event.primary_color)}&accent=${encodeURIComponent(event.accent_color)}&title=${encodeURIComponent(event.title)}`;
    } catch (error) {
      toast.error('Erro ao enviar formulário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    // Função auxiliar para fazer o parse das opções
    const parseOptions = (options?: string | string[]) => {
      if (!options) return [];
      if (Array.isArray(options)) return options;
      try {
        return JSON.parse(options);
      } catch {
        return [];
      }
    };

    const fieldOptions = parseOptions(field.options);

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            required={field.required}
          />
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            required={field.required}
          />
        );
      case 'select':
        return (
          <Select
            value={formData[field.id] || ''}
            onValueChange={(value) => setFormData({ ...formData, [field.id]: value })}
            required={field.required}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {fieldOptions.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {fieldOptions.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroup
                  value={formData[field.id] || ''}
                  onValueChange={(value) => setFormData({ ...formData, [field.id]: value })}
                  required={field.required}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                    <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {fieldOptions.map((option: string) => {
              const values = formData[field.id] || [];
              return (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option}`}
                    checked={values.includes(option)}
                    onCheckedChange={(checked) => {
                      const newValues = checked
                        ? [...values, option]
                        : values.filter((v: string) => v !== option);
                      setFormData({ ...formData, [field.id]: newValues });
                    }}
                  />
                  <Label htmlFor={`${field.id}-${option}`}>
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Flyer do Evento */}
          <div 
            className="bg-card rounded-xl shadow-lg overflow-hidden"
            style={{
              backgroundColor: event.primary_color,
            }}
          >
            {event.background_image_url && (
              <div className="relative w-full">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/20 min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}
                <Image
                  src={event.background_image_url}
                  alt={`Banner do evento ${event.title}`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto"
                  priority
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            )}

            <div className="p-6">
              <h1 className="text-3xl font-bold mb-2">
                {event.title}
              </h1>
              <p className="text-muted-foreground">{event.description}</p>
            </div>
          </div>

          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {event.sections.map((section) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <h2 className="text-xl font-semibold">{section.title}</h2>
                    {section.description && (
                      <p className="text-muted-foreground mb-4">{section.description}</p>
                    )}

                    <div className="space-y-4">
                      {section.fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <label className="text-sm font-medium">
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                          </label>
                          {renderField(field)}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                <Button
                  type="submit"
                  className="w-full text-white"
                  disabled={isSubmitting}
                  style={{ backgroundColor: event.accent_color }}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Enviar Formulário'
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}