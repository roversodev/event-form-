import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/events/:path*', '/login', '/register'],
};

export const dynamic = 'force-dynamic'
