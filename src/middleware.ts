import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

// Add routes that should be accessible without authentication
const publicRoutes = ['/login', '/setup-idip-admin'];

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const session = request.cookies.get('session')?.value;

  const isPublicRoute = publicRoutes.some(route => nextUrl.pathname.startsWith(route));

  // 1. If it's a public route and user is logged in, redirect to dashboard
  if (isPublicRoute && session) {
    const payload = await decrypt(session);
    if (payload) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. If it's not a public route and user is NOT logged in, redirect to login
  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Optional: Verify session integrity on every request
  if (session && !isPublicRoute) {
    const payload = await decrypt(session);
    if (!payload) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
