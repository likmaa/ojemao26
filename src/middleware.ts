import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ignorer la page de login pour éviter une boucle infinie
  if (request.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  // Vérifier si le cookie d'authentification admin est présent
  const isAuthenticated = request.cookies.get('admin_authenticated')?.value === 'true';

  if (!isAuthenticated) {
    // Rediriger vers la page de login
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check roles permissions
  const role = request.cookies.get('admin_role')?.value;
  
  if (role === 'hebergement') {
    // Rôle hebergement n'a accès qu'à /admin/inscriptions et pas aux autres pages comme /admin, /admin/events, /admin/parametres, etc.
    const allowedPaths = ['/admin/inscriptions', '/admin/login'];
    const isAllowed = allowedPaths.some(path => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + '/'));
    
    if (!isAllowed) {
      // S'il essaie d'aller sur le dashboard ou ailleurs, on le redirige sur inscriptions
      return NextResponse.redirect(new URL('/admin/inscriptions', request.url));
    }
  }

  return NextResponse.next();
}

// Configurer le matcher pour s'appliquer à toutes les routes sous /admin
export const config = {
  matcher: '/admin/:path*',
};
