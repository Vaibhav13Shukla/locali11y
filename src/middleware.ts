import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPPORTED_LOCALES = ["en", "es", "ja", "zh"];
const DEFAULT_LOCALE = "en";

function getLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (maybeLocale && SUPPORTED_LOCALES.includes(maybeLocale)) {
    return maybeLocale;
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    if (pathname.startsWith("/api")) {
      const response = NextResponse.next();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
              });
            },
          },
        }
      );
      await supabase.auth.getSession();
      return response;
    }
    return NextResponse.next();
  }

  const pathnameLocale = getLocaleFromPathname(pathname);

  if (!pathnameLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.getSession();

  if (pathname.includes("/dashboard") || pathname.includes("/demo")) {
    const isDemo = request.nextUrl.searchParams.get("demo") === "true";
    
    if (!isDemo) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = `/${pathnameLocale}/login`;
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
