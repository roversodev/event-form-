import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await new Promise((resolve) => {
      resolve(cookies());
    });
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Erro na sessão:', sessionError);
      return NextResponse.json(
        { error: 'Erro de autenticação' },
        { status: 401 }
      );
    }

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        responses:form_responses(count)
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedEvents = events.map(event => ({
      ...event,
      responses: event.responses[0].count,
      userId: event.user_id,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
      eventDate: event.event_date,
      backgroundImageUrl: event.background_image_url,
      primaryColor: event.primary_color,
      accentColor: event.accent_color
    }));

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar eventos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await new Promise((resolve) => {
      resolve(cookies());
    });
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Erro na sessão:', sessionError);
      return NextResponse.json(
        { error: 'Erro de autenticação' },
        { status: 401 }
      );
    }

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Primeiro, cria o evento
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        title: body.title,
        description: body.description,
        primary_color: body.primaryColor,
        accent_color: body.accentColor,
        background_image_url: body.backgroundImageUrl,
        event_date: body.eventDate,
        user_id: session.user.id
      })
      .select()
      .single();

    if (eventError) throw eventError;

    // Depois, cria as seções e campos
    for (const [sectionIndex, section] of body.sections.entries()) {
      const { data: sectionData, error: sectionError } = await supabase
        .from('form_sections')
        .insert({
          event_id: event.id,
          title: section.title,
          description: section.description,
          order_index: sectionIndex
        })
        .select()
        .single();

      if (sectionError) throw sectionError;

      // Cria os campos para cada seção
      const fieldsToInsert = section.fields.map((field: any, fieldIndex: number) => ({
        section_id: sectionData.id,
        type: field.type,
        label: field.label,
        placeholder: field.placeholder || null,
        required: field.required,
        options: field.options ? JSON.stringify(field.options) : null,
        order_index: fieldIndex
      }));

      const { error: fieldsError } = await supabase
        .from('form_fields')
        .insert(fieldsToInsert);

      if (fieldsError) throw fieldsError;
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao criar evento' },
      { status: 500 }
    );
  }
}