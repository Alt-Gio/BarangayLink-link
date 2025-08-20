import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/auth(.*)',
]);

// Define public routes that should redirect if authenticated
const isAuthRoute = createRouteMatcher([
  '/login',
  '/register',
]);

export default clerkMiddleware((auth, req) => {
  // Handle test-login route separately
  if (req.nextUrl.pathname === '/test-login') {
    return NextResponse.next();
  }

  // Check if test mode is enabled and user has test session
  const isTestModeEnabled = process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN === 'true';
  
  // If test mode is enabled, allow dashboard access without Clerk auth
  if (isTestModeEnabled && isProtectedRoute(req)) {
    // Allow access to dashboard in test mode
    // Test authentication will be handled by TestAuthContext
    return NextResponse.next();
  }

  // Get auth state
  const { userId } = auth();
  const isSignedIn = !!userId;

  // Redirect signed-in users away from auth pages
  if (isSignedIn && isAuthRoute(req)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Protect dashboard routes - redirect to login if not signed in (only in production)
  if (!isTestModeEnabled && !isSignedIn && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
