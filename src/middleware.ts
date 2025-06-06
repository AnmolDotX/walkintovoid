// src/middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isLoggedIn = !!token;
  const isAuthPage = pathname.startsWith('/signin') || pathname.startsWith('/signup');
  const isAdminPage = pathname.startsWith('/admin-dashboard') || pathname.startsWith('/admin-posts');

  // --- Case 1: User is logged in ---
  if (isLoggedIn) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // If a logged-in user tries to access an admin page, verify their role.
    if (isAdminPage) {
      const userRole = token.userType;
      if (userRole !== 'ADMIN' && userRole !== 'MODERATOR') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  }
  // --- Case 2: User is logged out ---
  else {
    if (isAdminPage) {
      const signInUrl = new URL('/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

// This config ensures the middleware runs on the specified paths.
export const config = {
  matcher: [
    '/signin',
    '/signup',
    '/admin-dashboard/:path*',
    '/admin-posts/:path*',
  ],
};