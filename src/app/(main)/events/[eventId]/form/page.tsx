'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

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
  logo_url?: string;
  background_image_url?: string;
  sections: FormSection[];
}

export default function EventForm() {
  const { eventId } = useParams();
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            required={field.required}
          >
            <option value="">Selecione uma opção</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={`${field.id}-${option}`}
                  name={field.id}
                  value={option}
                  checked={formData[field.id] === option}
                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  required={field.required}
                  className="h-4 w-4 border-input"
                />
                <label htmlFor={`${field.id}-${option}`} className="text-sm">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => {
              const values = formData[field.id] || [];
              return (
                <div key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`${field.id}-${option}`}
                    value={option}
                    checked={values.includes(option)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...values, option]
                        : values.filter((v: string) => v !== option);
                      setFormData({ ...formData, [field.id]: newValues });
                    }}
                    className="h-4 w-4 rounded border-input"
                  />
                  <label htmlFor={`${field.id}-${option}`} className="text-sm">
                    {option}
                  </label>
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
              <div className="w-full h-full">
                <img
                  src={`${event.background_image_url}`}
                  alt={`Banner do evento ${event.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              {event.logo_url && (
                <div className="w-24 h-24 mb-4">
                  <img
                    src={`${event.logo_url}`}
                    alt={`Logo do evento ${event.title}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <h1 className="text-3xl font-bold mb-2" style={{ color: event.accent_color }}>
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