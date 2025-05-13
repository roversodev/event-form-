import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Pega a URL base da requisição atual
  const baseUrl = requestUrl.origin;
  
  // Se estiver em localhost, usa a URL como está
  // Se estiver em produção, usa a URL de produção
  const redirectUrl = baseUrl.includes('localhost') 
    ? new URL('/dashboard', baseUrl)
    : new URL('/dashboard', process.env.NEXT_PUBLIC_SITE_URL || baseUrl);

  return NextResponse.redirect(redirectUrl);
}