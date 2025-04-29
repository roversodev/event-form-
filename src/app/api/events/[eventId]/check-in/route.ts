import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Solução temporária usando any para contornar problemas de tipagem
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const session = await getServerSession(authOptions);
    const eventId = context.params.eventId;

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

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
        responses: {
          select: {
            id: true,
            respondentName: true,
            responses: true,
            checkedIn: true,
            checkedInAt: true,
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

    return NextResponse.json(event);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar evento' },
      { status: 500 }
    );
  }
}