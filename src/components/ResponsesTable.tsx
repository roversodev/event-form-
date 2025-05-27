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
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10);
  const router = useRouter();

  React.useEffect(() => {
    setResponses(initialResponses);
  }, [initialResponses]);

  // Calcular índices para paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = responses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(responses.length / itemsPerPage);

  // Função para mudar de página
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setSelectedRows([]);
  };

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

  // Função para gerar array de páginas com ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Número máximo de páginas visíveis
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      // Se tiver menos páginas que o máximo, mostra todas
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Sempre mostra a primeira página
    pageNumbers.push(1);

    if (currentPage > halfVisible + 1) {
      pageNumbers.push('...');
    }

    // Páginas ao redor da página atual
    const start = Math.max(2, currentPage - halfVisible);
    const end = Math.min(totalPages - 1, currentPage + halfVisible);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - halfVisible) {
      pageNumbers.push('...');
    }

    // Sempre mostra a última página
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.length === currentItems.length}
                  onCheckedChange={(checked) => {
                    setSelectedRows(checked ? currentItems.map(r => r.id) : []);
                  }}
                />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((response) => (
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

      {/* Paginação */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, responses.length)} de {responses.length}
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <div
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-8 h-8 text-sm text-muted-foreground"
              >
                ...
              </div>
            ) : (
              <Button
                key={`page-${page}`}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page as number)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            )
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
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
