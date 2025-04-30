'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Response {
  id: string;
  respondent_name: string; // Atualizado para snake_case
  responses: string;
  checked_in: boolean; // Atualizado para snake_case
  checked_in_at?: string; // Atualizado para snake_case
}

interface Event {
  id: string;
  title: string;
  description: string;
  sections: Array<{
    id: string;
    title: string;
    fields: Array<{
      id: string;
      label: string;
      type: string;
      options?: string;
    }>;
  }>;
  responses: Response[];
}

export default function CheckInPage() {
  const { eventId } = useParams();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedResponse, setSelectedResponse] = React.useState<Response | null>(null);
  const [isCheckingIn, setIsCheckingIn] = React.useState(false);

  const { data: event, isLoading, refetch } = useQuery<Event>({
    queryKey: ['event-check-in', eventId],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}/check-in`);
      if (!response.ok) throw new Error('Erro ao carregar evento');
      return response.json();
    }
  });

  const handleCheckIn = async (responseId: string) => {
    setIsCheckingIn(true);
    try {
      const response = await fetch(`/api/events/${eventId}/check-in/${responseId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erro ao realizar check-in');
      }

      refetch();
      setSelectedResponse(null);
      toast.success('Check-in realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao realizar check-in. Tente novamente.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const formatResponseData = (responseData: string) => {
    try {
      const parsedData = JSON.parse(responseData);
      return event?.sections.map(section => {
        const sectionFields = section.fields.map(field => {
          const value = parsedData[field.id];
          let formattedValue = value;

          // Formata o valor baseado no tipo do campo
          if (Array.isArray(value)) {
            formattedValue = value.join(', ');
          } else if (value === undefined || value === null || value === '') {
            formattedValue = 'Não respondido';
          } else if (field.type === 'date' && value) {
            formattedValue = new Date(value).toLocaleDateString('pt-BR');
          } else if (field.type === 'datetime' && value) {
            formattedValue = new Date(value).toLocaleString('pt-BR');
          }

          return {
            label: field.label,
            value: formattedValue
          };
        });
        return {
          title: section.title,
          fields: sectionFields
        };
      }) || [];
    } catch (error) {
      console.error('Erro ao parsear respostas:', error);
      return [];
    }
  };

  const filteredResponses = event?.responses.filter(response =>
    response.respondent_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-8 min-h-[80vh]">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[80vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{event?.title}</h1>
        <p className="text-muted-foreground">Gerenciamento de Check-in</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-muted-foreground">
          {filteredResponses.length} convidados encontrados
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResponses.map((response) => (
              <TableRow key={response.id}>
                <TableCell className="font-medium">
                  {response.respondent_name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {response.checked_in ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">Check-in realizado</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Pendente</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedResponse(response)}
                    disabled={response.checked_in}
                  >
                    {response.checked_in ? 'Já realizou check-in' : 'Realizar Check-in'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedResponse} onOpenChange={() => setSelectedResponse(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirmar Check-in</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">
              {selectedResponse?.respondent_name}
            </h3>
            
            <div className="space-y-6">
              {selectedResponse && formatResponseData(selectedResponse.responses)?.map((section, index) => (
                <div key={index} className="space-y-3 border-b pb-4 last:border-b-0">
                  <h4 className="font-medium text-lg">{section.title}</h4>
                  <div className="space-y-3">
                    {section.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="grid grid-cols-2 gap-4">
                        <span className="text-sm font-medium text-muted-foreground">{field.label}</span>
                        <span className="text-sm">{field.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedResponse(null)}
              disabled={isCheckingIn}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => selectedResponse && handleCheckIn(selectedResponse.id)}
              disabled={isCheckingIn}
            >
              {isCheckingIn ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Confirmando...
                </>
              ) : (
                'Confirmar Check-in'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}