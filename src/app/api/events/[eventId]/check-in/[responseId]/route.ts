import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Abordagem simplificada para Next.js 15
export async function POST(
  request: NextRequest,
  context: any // Use 'any' temporariamente para contornar problemas de tipagem
) {
  try {
    const session = await getServerSession(authOptions);
    const { eventId, responseId } = context.params;
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const response = await prisma.formResponse.update({
      where: {
        id: responseId,
        eventId: eventId,
      },
      data: {
        checkedIn: true,
        checkedInAt: new Date(),
      }
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao realizar check-in:', error);
    return NextResponse.json(
      { error: 'Erro ao realizar check-in' },
      { status: 500 }
    );
  }
}