import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  console.log('Request URL:', requestUrl.toString());
  console.log('Origin:', requestUrl.origin);

  if (code) {
    const cookieStore = await new Promise((resolve) => {
        resolve(cookies());
      });
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
    
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redireciona sempre para a origem da requisição
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}