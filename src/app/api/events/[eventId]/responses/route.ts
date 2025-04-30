import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: any
) {
  try {
    const params = await context.params;
    const eventId = params.eventId;
    const { formData } = await request.json();
    const cookieStore = await new Promise((resolve) => {
      resolve(cookies());
    });
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });

    // Verifica se o evento existe
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select(`
        *,
        sections:form_sections(
          *,
          fields:form_fields(*)
        )
      `)
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    // Encontra o campo de nome nos dados do formulário
    const nameField = Object.entries(formData).find(([fieldId, value]) => {
      const field = event.sections
        .flatMap((s: { fields: any; }) => s.fields)
        .find((f: { id: string; label: string; }) => f.id === fieldId && f.label.toLowerCase().includes('nome'));
      return field !== undefined;
    });

    // Obtém o nome do respondente dos dados do formulário ou usa um padrão
    const respondentName = nameField ? String(nameField[1]) : 'Anonymous';

    // Converte os dados do formulário para string
    const responses = JSON.stringify(formData);

    // Cria a resposta do formulário no Supabase
    const { data: response, error: responseError } = await supabase
      .from('form_responses')
      .insert({
        event_id: eventId,
        respondent_name: respondentName,
        responses
      })
      .select()
      .single();

    if (responseError) throw responseError;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao salvar resposta:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar resposta' },
      { status: 500 }
    );
  }
}