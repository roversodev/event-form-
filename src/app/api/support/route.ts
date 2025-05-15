import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { SupportEmail } from '@/emails/SupportEmail';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const cookieStore = await new Promise((resolve) => {
        resolve(cookies());
      });
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
    const { data: { session } } = await supabase.auth.getSession();

    const body = await request.json();
    const { subject, message, to } = body;
    
    const userEmail = session?.user?.email || 'Usuário não autenticado';

    // Aguarda a renderização do template
    const emailHtml = await render(React.createElement(SupportEmail, {
      userEmail,
      subject,
      message,
    }));

    await resend.emails.send({
      from: 'EventForm+ <contato@roversodev.com.br>',
      to: [to],
      subject: `[Suporte EventForm+] ${subject}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    );
  }
}