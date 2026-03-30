import { type NextRequest, NextResponse } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/pipeline',
  '/contacts',
  '/estimates',
  '/invoices',
  '/schedule',
  '/settings',
  '/setup',
  '/activity',
  '/advisor',
  '/automations',
  '/messages',
  '/notifications',
];

// Auth routes
const authRoutes = ['/login'];

// Public routes (no auth required)
const publicRoutes = ['/', '/pricing', '/about'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the session cookie
  const sessionCookie = request.cookies.get('sb-access-token');
  const hasSession = !!sessionCookie?.value;

  // If user is logged in and tries to access login page, redirect to dashboard
  if (hasSession && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If accessing protected route without session, redirect to login
  // Only enforce auth if Supabase is configured (env vars present)
  const supabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (isProtectedRoute && !hasSession && supabaseConfigured) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow all other requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
