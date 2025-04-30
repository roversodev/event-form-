import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DialogHeader, DialogFooter } from "./ui/dialog";

interface Response {
  id: string;
  respondent_name: string;
  created_at: string;
}

interface FormResponse {
  event_id: any;
  id: string;
  respondent_name: string; // Changed from respondentName to match Supabase
  responses: string;
  created_at: string; // Changed from createdAt to match Supabase
}

interface Props {
  responses: Response[];
  onViewDetails: (response: Response) => void;
  onDeleteSelected: (ids: string[]) => void;
}



export function ResponseDataTable({ 
  responses: initialResponses, 
  onViewDetails,
  onDeleteSuccess 
}: { 
  responses: FormResponse[],
  onViewDetails: (response: FormResponse) => void,
  onDeleteSuccess?: () => void
}) {
  const [responses, setResponses] = React.useState<FormResponse[]>(initialResponses);
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setResponses(initialResponses);
  }, [initialResponses]);

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      await Promise.all(
        selectedRows.map(async (responseId) => {
          const response = await fetch(`/api/events/${responses[0].event_id}/responses/${responseId}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error(`Erro ao excluir resposta ${responseId}`);
          }
        })
      );

      // Atualiza o estado local removendo as respostas excluídas
      setResponses(prevResponses => 
        prevResponses.filter(response => !selectedRows.includes(response.id))
      );

      toast.success('Respostas excluídas com sucesso!');
      setSelectedRows([]);
      
      // Notifica o componente pai sobre a exclusão bem-sucedida
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Erro ao excluir respostas:', error);
      toast.error('Erro ao excluir respostas. Tente novamente.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.length === responses.length}
                  onCheckedChange={(checked) => {
                    setSelectedRows(checked ? responses.map(r => r.id) : []);
                  }}
                />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response) => (
              <TableRow key={response.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(response.id)}
                    onCheckedChange={(checked) => {
                      setSelectedRows(
                        checked 
                          ? [...selectedRows, response.id]
                          : selectedRows.filter(id => id !== response.id)
                      );
                    }}
                  />
                </TableCell>
                <TableCell>{response.respondent_name}</TableCell>
                <TableCell>
                  {format(new Date(response.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(response)}
                  >
                    Ver detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedRows.length > 0 && (
        <div className="mt-4 flex items-center gap-2 p-3 pt-0">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir selecionados ({selectedRows.length})
          </Button>
        </div>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader className="p-3">
            <DialogTitle>Excluir Respostas</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir {selectedRows.length} resposta(s)? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center gap-2 p-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Sim, excluir respostas'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
