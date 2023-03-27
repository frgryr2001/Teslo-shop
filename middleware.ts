// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  //   get token from request cookies
  // const value = request.cookies.get('token')?.value || '';
  // const cart = request.cookies.get('cart')?.value || [];
  // if (cart.length === 0) {
  //   const { protocol, host } = request.nextUrl;
  //   // here the instructor uses p instead of previousPath
  //   return NextResponse.redirect(`${protocol}//${host}/`);
  // }
  // try {
  //   await jose.jwtVerify(
  //     value,
  //     new TextEncoder().encode(process.env.JWT_SECRET_SEED || '')
  //   );
  //   return NextResponse.next();
  // } catch (error: any) {
  //   console.error(`JWT Invalid or not signed in`, { error });
  //   const { protocol, host, pathname } = request.nextUrl;
  //   // here the instructor uses p instead of previousPath
  //   return NextResponse.redirect(
  //     `${protocol}//${host}/auth/login?p=${pathname}`
  //   );
  // }

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
  const userRole = session.user.role;
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
