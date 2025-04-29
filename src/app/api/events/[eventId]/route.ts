import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: any // Usando any para contornar problemas de tipagem no Next.js 15
) {
  try {
    const { eventId } = context.params;
    const includeResponses = new URL(request.url).searchParams.get('includeResponses') === 'true';

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        sections: {
          orderBy: {
            orderIndex: 'asc'
          },
          include: {
            fields: {
              orderBy: {
                orderIndex: 'asc'
              }
            }
          }
        },
        responses: includeResponses
      }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    const formattedEvent = {
      ...event,
      sections: event.sections.map(section => ({
        ...section,
        fields: section.fields.map(field => ({
          ...field,
          options: field.options ? JSON.parse(field.options) : null
        }))
      }))
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
  context: any // Também usando any aqui para acessar params
) {
  try {
    const session = await getServerSession(authOptions);
    const { eventId } = context.params;

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    await prisma.$transaction([
      prisma.emailReminder.deleteMany({ where: { eventId } }),
      prisma.formResponse.deleteMany({ where: { eventId } }),
      prisma.formField.deleteMany({
        where: {
          section: { eventId }
        }
      }),
      prisma.formSection.deleteMany({ where: { eventId } }),
      prisma.event.delete({ where: { id: eventId } })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir evento' },
      { status: 500 }
    );
  }
}
