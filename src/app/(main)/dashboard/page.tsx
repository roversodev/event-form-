'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Search, Calendar, User, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';
import { toast } from 'sonner';
import { UserSubscription } from '@/types/subscription';

interface Event {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  userId: string;
  responses: number;
}

const Dashboard = () => {
  const router = useRouter();
  const supabase = useSupabase();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [copiedEventId, setCopiedEventId] = React.useState<string | null>(null);

  // Adicionar estado para o plano do usuário
  // const [userSubscription, setUserSubscription] = React.useState<UserSubscription | null>(null);

  // Modificar a query para incluir a verificação de assinatura
  const { data: events = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return [];
      }

      // Buscar a assinatura do usuário
      // const subscriptionResponse = await fetch('/api/subscription');
      // const subscriptionData = await subscriptionResponse.json();
      // setUserSubscription(subscriptionData);

      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Falha ao carregar eventos');
      }
      return response.json();
    }
  });

  // Função para verificar se pode criar novo formulário
  // const canCreateNewForm = () => {
  //   if (!userSubscription || userSubscription.plan === 'free') {
  //     return events.length < 1;
  //   }
  //   if (userSubscription.plan === 'pro') {
  //     return events.length < 5;
  //   }
  //   return true; // Enterprise tem formulários ilimitados
  // };

  // Modificar o botão de novo evento
  const handleNewEventClick = () => {
    // if (!canCreateNewForm()) {
    //   toast.error('Você atingiu o limite de formulários do seu plano. Faça upgrade para criar mais!');
    //   router.push('/pricing');
    //   return;
    // }
    router.push('/new-event');
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (eventId: string) => {
    const url = `${window.location.origin}/events/${eventId}/form`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedEventId(eventId);
      toast.success('Link copiado para a área de transferência!');
      setTimeout(() => setCopiedEventId(null), 2000); // Resetar após 2 segundos
    }).catch(err => {
      console.error('Erro ao copiar o link: ', err);  });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Seus Eventos</h1>
            <p className="text-muted-foreground">Gerencie seus formulários e eventos</p>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-[250px]"
              />
            </div>

            <Button onClick={handleNewEventClick}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </div>
        </div>

        {eventsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border rounded-xl p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-8" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-9 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Nenhum evento encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm ? 'Tente uma busca diferente ou crie um novo evento.' : 'Crie seu primeiro evento para começar.'}
                </p>
                <Link href="/new-event">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Evento
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border rounded-xl p-6 hover:shadow-md transition-shadow bg-card relative"
                  >
                    <div className="inline-flex justify-between items-center w-full">
                      <div>
                        <h3 className="font-semibold text-xl mb-2">{event.title}</h3>
                        <p className="text-muted-foreground mb-6 line-clamp-2">{event.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(event.id)}
                      >
                        {copiedEventId === event.id ? <Check className="h-1 w-1" /> : <Copy className="h-1 w-1" />}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-4 w-4" />
                        <span>{event.responses} respostas</span>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/events/${event.id}/form`}>
                          <Button size="sm" variant="outline">Ver form</Button>
                        </Link>
                        <Link href={`/events/${event.id}`}>
                          <Button size="sm">Gerenciar</Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </main>


    </div>
  );
};

export default Dashboard;
