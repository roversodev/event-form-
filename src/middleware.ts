import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Se estiver tentando acessar páginas autenticadas sem sessão
  if (!session && (
    req.nextUrl.pathname.startsWith('/dashboard') || 
    req.nextUrl.pathname.startsWith('/new-event') || 
    req.nextUrl.pathname.startsWith('/pricing') ||
    (req.nextUrl.pathname.startsWith('/events') && !req.nextUrl.pathname.includes('/form') && !req.nextUrl.pathname.startsWith('/api'))
  )) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Se estiver tentando acessar login/register com sessão ativa
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/events/:path*', '/login', '/register'],
};

export const dynamic = 'force-dynamic'
