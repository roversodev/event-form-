'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Loader2, HelpCircle } from 'lucide-react';

export function SupportButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const subject = formData.get('subject');
    const message = formData.get('message');

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          message,
          to: 'contato@roversodev.com.br'
        }),
      });

      if (!response.ok) throw new Error('Erro ao enviar mensagem');

      toast.success('Mensagem enviada com sucesso! Em breve entraremos em contato.');
      setIsOpen(false);
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className='font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent'>Suporte EventForm+</DialogTitle>
          <DialogDescription>
            Envie sua mensagem para nossa equipe de suporte. Responderemos o mais breve possível!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="subject"
              name="subject"
              placeholder="Assunto"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              id="message"
              name="message"
              placeholder="Descreva sua dúvida ou problema..."
              required
              disabled={isLoading}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Mensagem'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}