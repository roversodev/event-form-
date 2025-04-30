import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  context: any
) {
  try {
    const cookieStore = await new Promise((resolve) => {
      resolve(cookies());
    });
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
    const { eventId } = await context.params;
    const includeResponses = new URL(request.url).searchParams.get('includeResponses') === 'true';

    // Buscar o evento com suas seções e campos
    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        sections:form_sections(
          *,
          fields:form_fields(*)
        ),
        responses:form_responses(*)
      `)
      .eq('id', eventId)
      .order('order_index', { foreignTable: 'form_sections' })
      .order('order_index', { foreignTable: 'form_sections.form_fields' })
      .single();

    if (error) throw error;

    if (!event) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    // Formatar o evento para manter a mesma estrutura anterior
    const formattedEvent = {
      ...event,
      sections: event.sections.map((section: { fields: any[]; }) => ({
        ...section,
        fields: section.fields.map((field: { options: string; }) => ({
          ...field,
          options: field.options ? JSON.parse(field.options) : null
        }))
      })),
      responses: includeResponses ? event.responses : undefined
    };

    return NextResponse.json(formattedEvent);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar evento' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: any
) {
  try {
    const cookieStore = await new Promise((resolve) => {
      resolve(cookies());
    });
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
    const { data: { session } } = await supabase.auth.getSession();
    const { eventId } = await context.params;

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Verificar se o usuário é dono do evento e obter a URL da imagem
    const { data: event } = await supabase
      .from('events')
      .select('user_id, background_image_url')
      .eq('id', eventId)
      .single();

    if (!event || event.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Se houver uma imagem de fundo, deletá-la do bucket
    if (event.background_image_url) {
      // Extrair o nome do arquivo da URL
      const fileName = event.background_image_url.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('flyer-bucket')
          .remove([`public/${fileName}`]);

        if (storageError) {
          console.error('Erro ao deletar imagem:', storageError);
          // Continuar mesmo se houver erro ao deletar a imagem
        }
      }
    }

    // Deletar o evento (as políticas RLS e as foreign keys CASCADE cuidarão do resto)
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir evento' },
      { status: 500 }
    );
  }
}
