import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 1. Creamos una respuesta base
  // Esto es necesario para poder escribir cookies en ella después
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // NUEVA SINTAXIS:
        // En lugar de get/set/remove individuales, usamos getAll y setAll
        
        getAll() {
          return request.cookies.getAll();
        },
        
        setAll(cookiesToSet) {
          // Aquí ocurre la magia: actualizamos las cookies tanto en el 'request'
          // (para que la app lo sepa ahora mismo) como en el 'response' (para el navegador)
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 2. Verificamos quién es el usuario
  // IMPORTANTE: En middleware siempre se usa 'getUser' (valida en servidor), no 'getSession' (cache local)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Lógica de Protección (El Portero)

  // A. Si NO está logueado y quiere ir a cualquier lado que NO sea el login...
  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    // ...lo mandamos al login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // B. Si YA está logueado y quiere ir al login...
  if (user && request.nextUrl.pathname.startsWith('/login')) {
    // ...lo mandamos a la página principal
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Si todo está bien, dejamos pasar la respuesta (con las cookies actualizadas si hubo refresh)
  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica a todo MENOS a:
     * - rutas de API (/api/...)
     * - archivos estáticos (_next/static/...)
     * - imágenes optimizadas (_next/image/...)
     * - favicon.ico
     * - archivos públicos (.png, .jpg, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
