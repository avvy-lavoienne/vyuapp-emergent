import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === '/admin/login';
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

  // Only enforce auth on admin routes
  if (!isAdminRoute) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Unauthenticated user trying to access admin (not login page) → redirect to login
  if (!isLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated user → verify admin role
  if (user) {
    const adminEmail =
      process.env.SUPABASE_ADMIN_EMAIL || 'vyuapp@proton.me';

    const isAdmin = user.email === adminEmail;

    if (!isAdmin) {
      // Non-admin authenticated user → redirect away from admin
      if (!isLoginRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(url);
      }
    }

    // Admin user on login page → redirect to admin dashboard
    if (isLoginRoute && isAdmin) {
      const url = request.nextUrl.clone();
      const next = request.nextUrl.searchParams.get('next') || '/admin';
      url.pathname = next.startsWith('/admin') ? next : '/admin';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
