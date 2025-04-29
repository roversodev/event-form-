import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  context: any // Usando any para contornar problemas de tipagem
) {
  try {
    const eventId = context.params.eventId;
    const { formData } = await request.json();

    // Verifica se o evento existe
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        sections: {
          include: {
            fields: true
          }
        }
      }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    // Find the name field in the form data
    const nameField = Object.entries(formData).find(([fieldId, value]) => {
      const field = event.sections
        .flatMap(s => s.fields)
        .find(f => f.id === fieldId && f.label.toLowerCase().includes('nome'));
      return field !== undefined;
    });

    // Get the respondent name from the form data or use a default
    const respondentName = nameField ? String(nameField[1]) : 'Anonymous';

    // Convert form data to responses string
    const responses = JSON.stringify(formData);

    // Cria a resposta do formulário
    const response = await prisma.formResponse.create({
      data: {
        eventId,
        respondentName,
        responses // This contains the stringified form data
      }
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao salvar resposta:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar resposta' },
      { status: 500 }
    );
  }
}