import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  context: any
) {
  try {
    const params = await context.params;
    const cookieStore = await new Promise((resolve) => {
      resolve(cookies());
    });
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });

    // Verifica autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    // Verifica se o usuário tem permissão para excluir respostas deste evento
    const { data: event } = await supabase
      .from('events')
      .select('user_id')
      .eq('id', params.eventId)
      .single();

    if (!event || event.user_id !== session.user.id) {
      return new NextResponse('Não autorizado', { status: 403 });
    }

    // Exclui a resposta
    const { error } = await supabase
      .from('form_responses')
      .delete()
      .eq('id', params.responseId)
      .eq('event_id', params.eventId);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao excluir resposta:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}