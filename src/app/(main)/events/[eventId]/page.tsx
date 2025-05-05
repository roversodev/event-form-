'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Download,
  Search,
  User,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { ResponseDataTable } from '@/components/ResponsesTable';


interface FormResponse {
  event_id: string; // Changed from eventId to match Supabase colum
  id: string;
  respondent_name: string; // Changed from respondentName to match Supabase
  responses: string;
  created_at: string; // Changed from createdAt to match Supabase
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
    }>;
  }>;
  responses: FormResponse[];
}

export default function EventManagement() {
  const { eventId } = useParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedResponse, setSelectedResponse] = React.useState<FormResponse | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const { data: event, isLoading, refetch } = useQuery<Event>({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}?includeResponses=true`);
      if (!response.ok) throw new Error('Erro ao carregar evento');
      return response.json();
    }
  });

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

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-destructive">Evento não encontrado</p>
      </div>
    );
  }

  const filteredResponses = (event.responses || []).filter(response =>
    response.respondent_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    toast.info('Exportando respostas...');
    try {
      // Prepara o cabeçalho do CSV
      const headers = ['Nome', 'Data de Envio'];
      event.sections.forEach(section => {
        section.fields.forEach(field => {
          headers.push(`${section.title} - ${field.label}`);
        });
      });

      // Prepara as linhas de dados
      const rows = filteredResponses.map(response => {
        const row = [];

        // Adiciona nome e data
        row.push(
          response.respondent_name,
          format(new Date(response.created_at), "dd/MM/yyyy HH:mm:ss")
        );

        // Parse as respostas
        const parsedResponses = JSON.parse(response.responses);

        // Adiciona cada resposta em sua própria coluna
        event.sections.forEach(section => {
          section.fields.forEach(field => {
            const value = parsedResponses[field.id];
            const formattedValue = Array.isArray(value)
              ? value.join('; ')
              : value || '';
            row.push(formattedValue);
          });
        });

        return row;
      });

      // Converte para formato CSV com BOM para suporte adequado a caracteres especiais
      const BOM = '\uFEFF';
      const csvContent = BOM + [
        headers.join(','),
        ...rows.map(row =>
          row.map(cell =>
            `"${String(cell).replace(/"/g, '""')}"`
          ).join(',')
        )
      ].join('\n');

      // Cria o blob e faz o download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${event.title}_respostas.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Respostas exportadas com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      toast.error('Erro ao exportar respostas. Tente novamente.');
    }
  };

  const handleViewDetails = (response: FormResponse) => {
    setSelectedResponse(response);
  };

  const handleCloseDialog = () => {
    setSelectedResponse(null);
  };

  const formatResponseData = (responseData: string) => {
    try {
      const parsedData = JSON.parse(responseData);
      return event?.sections.map(section => {
        const sectionFields = section.fields.map(field => {
          const value = parsedData[field.id];
          return {
            label: field.label,
            value: Array.isArray(value) ? value.join(', ') : value || 'Não respondido'
          };
        });
        return {
          title: section.title,
          fields: sectionFields
        };
      });
    } catch (error) {
      console.error('Erro ao parsear respostas:', error);
      return [];
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir evento');
      }

      toast.success('Evento excluído com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      toast.error('Erro ao excluir evento. Tente novamente.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[80vh]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-start md:items-center gap-4 w-full">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-1">{event.title}</h1>
            <p className="text-muted-foreground">{event.description}</p>
          </div>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir Formulário
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <p className="text-muted-foreground">
            {filteredResponses.length} respostas encontradas
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button onClick={handleExportCSV} className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>

          <Link href={`/events/${eventId}/check-in`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Check-in
            </Button>
          </Link>

          <Link href={`/events/${eventId}/dashboard`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>


      {filteredResponses.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma resposta encontrada</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Tente ajustar sua busca para encontrar mais respostas"
              : "Aguardando respostas do formulário"}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <ResponseDataTable
            responses={filteredResponses}
            onViewDetails={handleViewDetails}
            onDeleteSuccess={() => refetch()}
          />
        </div>
      )}

      <Dialog open={!!selectedResponse} onOpenChange={() => handleCloseDialog()}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Respostas de {selectedResponse?.respondent_name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Enviado em {selectedResponse && format(new Date(selectedResponse.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
            </p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {selectedResponse && formatResponseData(selectedResponse.responses).map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-medium">{section.title}</h3>
                <div className="space-y-2">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="grid grid-cols-2 gap-2 py-2 border-b last:border-0">
                      <span className="text-muted-foreground">{field.label}</span>
                      <span>{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Formulário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este formulário? Esta ação não pode ser desfeita e todas as respostas serão perdidas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEvent}
            >
              Sim, excluir formulário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
