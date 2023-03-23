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

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || '',
  });
  if (!session) {
    const requestedPge = req.nextUrl.pathname;
    const url = req.nextUrl.clone();
    url.pathname = `/auth/login`;
    url.search = `p=${requestedPge}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: ['/checkout/:path*'],
};
