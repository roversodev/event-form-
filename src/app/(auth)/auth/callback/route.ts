import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const referer = request.headers.get('Referer');
  const baseUrl = referer ? new URL(referer).origin : requestUrl.origin;

  if (code) {
    const cookieStore = await new Promise((resolve) => {
        resolve(cookies());
      });
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
    
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL('/dashboard', baseUrl));
}