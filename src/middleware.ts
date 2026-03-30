import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Next.js middleware that:
 * 1. Refreshes the Supabase auth session on every request (keeps tokens fresh)
 * 2. Protects app routes — redirects to /login if not authenticated
 * 3. Falls back to open access when Supabase isn't configured (demo mode)
 */

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

// Auth routes — redirect to dashboard if already logged in
const authRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, allow everything (demo mode)
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  // Create a response we can modify (for setting refreshed cookies)
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Create Supabase client that can read/write cookies
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh the session — this is the primary purpose of the middleware.
  // It keeps the auth token fresh for server-side API routes.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (user && authRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // For protected routes: require auth when NEXT_PUBLIC_REQUIRE_AUTH is set
  // This lets us keep demo mode working while enforcing auth for paid clients
  const requireAuth = process.env.NEXT_PUBLIC_REQUIRE_AUTH === 'true';
  if (isProtectedRoute && !user && requireAuth) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Don't protect API routes here — they handle their own auth
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
