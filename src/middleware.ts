import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Redirect logged-in users away from landing & auth pages → home
  if (user && (path === '/' || path === '/auth/login' || path === '/auth/signup')) {
    return NextResponse.redirect(new URL('/app/home', request.url))
  }

  // Protect /app/* routes
  if (path.startsWith('/app/') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Protect /onboarding/* routes
  if (path.startsWith('/onboarding/') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Protect /admin/* routes — must be logged in + admin role
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/app/home', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/', '/auth/:path*', '/app/:path*', '/onboarding/:path*', '/invite/:path*', '/admin/:path*', '/admin'],
}
