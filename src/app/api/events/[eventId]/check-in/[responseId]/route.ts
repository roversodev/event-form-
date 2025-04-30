import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: any
) {
  try {
    const cookieStore = await new Promise((resolve) => {
      resolve(cookies());
    });
    
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    const { eventId, responseId } = await context.params;

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Atualiza o status de check-in da resposta
    const { data: response, error: updateError } = await supabase
      .from('form_responses')
      .update({
        checked_in: true,
        checked_in_at: new Date().toISOString()
      })
      .eq('id', responseId)
      .eq('event_id', eventId)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao atualizar check-in:', updateError);
      throw updateError;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao realizar check-in:', error);
    return NextResponse.json(
      { error: 'Erro ao realizar check-in' },
      { status: 500 }
    );
  }
}