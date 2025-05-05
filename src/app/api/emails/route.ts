import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const emailTemplate = (content: { title: string; message: string; eventTitle?: string }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 32px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo {
      font-size: 32px;
      font-weight: 800;
      background: linear-gradient(to right, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 16px;
    }
    .content {
      padding: 24px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
      color: #64748b;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(to right, #6366f1, #8b5cf6);
      color: white !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 24px;
      transition: transform 0.2s;
      box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
    }
    .button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
    }
    .event-title {
      font-size: 24px;
      font-weight: 600;
      background: linear-gradient(to right, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 20px 0;
    }
    ul {
      padding-left: 24px;
      margin: 16px 0;
    }
    li {
      margin: 8px 0;
      color: #334155;
    }
    p {
      color: #334155;
      margin: 16px 0;
    }
    h1 {
      color: #1e293b;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">EventForm+</div>
    </div>
    <div class="content">
      <h1>${content.title}</h1>
      ${content.message}
      ${content.eventTitle ? `<p class="event-title">${content.eventTitle}</p>` : ''}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} EventForm+. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
`;

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();
    const cookieStore = await new Promise((resolve) => {
        resolve(cookies());
      });
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });

    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY não está configurada');
    }

    if (type === 'welcome') {
      const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: data.email,
        subject: 'Bem-vindo ao Event Form!',
        html: emailTemplate({
          title: 'Bem-vindo ao EventForm+!',
          message: `
            <p>Olá ${data.name}!</p>
            <p>Estamos muito felizes em ter você conosco! Com o EventForm+, você pode:</p>
            <ul>
              <li>Criar formulários personalizados para seus eventos</li>
              <li>Gerenciar respostas e participantes</li>
              <li>Acompanhar check-ins em tempo real</li>
            </ul>
            <p>Comece agora mesmo criando seu primeiro evento!</p>
            <center>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="button">
                Acessar EventForm+
              </a>
            </center>
          `
        })
      });

      if (!result || result.error) {
        throw new Error(`Erro ao enviar e-mail: ${result?.error?.message || 'Erro desconhecido'}`);
      }
    } else if (type === 'event_reminder') {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: data.email,
        subject: `Lembrete: ${data.eventTitle}`,
        html: emailTemplate({
          title: 'Lembrete de Evento',
          message: `
            <p>Olá ${data.name}!</p>
            <p>Não se esqueça que você tem um evento hoje!</p>
            <p>Estamos enviando este lembrete para garantir que você não perca nenhum detalhe importante.</p>
          `,
          eventTitle: data.eventTitle
        })
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro detalhado ao enviar e-mail:', error);
    return NextResponse.json(
      { error: `Erro ao enviar e-mail: ${error.message}` },
      { status: 500 }
    );
  }
}