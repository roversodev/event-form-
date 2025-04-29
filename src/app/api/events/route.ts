import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const events = await prisma.event.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        _count: {
          select: { responses: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Formata os eventos para incluir a contagem de respostas
    const formattedEvents = events.map(event => ({
      ...event,
      responses: event._count.responses,
      _count: undefined
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
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        primaryColor: body.primaryColor,
        accentColor: body.accentColor,
        backgroundImageUrl: body.backgroundImageUrl,
        eventDate: body.eventDate,
        userId: session.user.id,
        sections: {
          create: body.sections.map((section: any, sectionIndex: number) => ({
            title: section.title,
            description: section.description,
            orderIndex: sectionIndex,
            fields: {
              create: section.fields.map((field: any, fieldIndex: number) => ({
                type: field.type,
                label: field.label,
                placeholder: field.placeholder || null,
                required: field.required,
                options: field.options ? JSON.stringify(field.options) : null,
                orderIndex: fieldIndex,
              }))
            }
          }))
        }
      }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao criar evento' },
      { status: 500 }
    );
  }
}