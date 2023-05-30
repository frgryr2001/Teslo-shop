// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || '',
  });

  const requestedPge = req.nextUrl.pathname;
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = `/auth/login`;
    url.search = `p=${requestedPge}`;

    if (requestedPge.includes('/api')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.redirect(url);
  }
  const validRoles = ['admin', 'super-user', 'SEO'];

  const userRole = session!.user.role;
  if (
    (requestedPge.includes('/api/admin') || requestedPge.includes('/admin')) &&
    !validRoles.includes(userRole)
  ) {
    return new Response(JSON.stringify({ message: 'You are not allowed' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return NextResponse.next();
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: [
    '/checkout/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/orders/:path*',
    '/api/orders/:path*',
  ],
};
