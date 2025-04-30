import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const cookieStore = await new Promise((resolve) => {
      resolve(cookies());
    });
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    const params = await context.params;
    const eventId = params.eventId;

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select(`
        *,
        sections:form_sections (
          id,
          title,
          description,
          order_index,
          fields:form_fields (
            id,
            type,
            label,
            placeholder,
            required,
            options,
            order_index
          )
        ),
        responses:form_responses (
          id,
          respondent_name,
          responses,
          checked_in,
          checked_in_at
        )
      `)
      .eq('id', eventId)
      .order('order_index', { foreignTable: 'sections' })
      .order('order_index', { foreignTable: 'sections.fields' })
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar evento' },
      { status: 500 }
    );
  }
}