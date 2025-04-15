import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/tasks", "/leave", "/profile", "/admin"]; // Add base paths
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const authToken = request.cookies.get("firebaseAuthToken")?.value; // Assumes you store a token cookie on login

	const isProtectedRoute = PROTECTED_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(route + "/")
	);
	const isAdminRoute = ADMIN_ROUTES.some((route) =>
		pathname.startsWith(route)
	);
	const isAuthRoute = AUTH_ROUTES.includes(pathname);

	// --- Redirect Logic ---

	// If trying to access protected/admin routes without auth token, redirect to login
	if ((isProtectedRoute || isAdminRoute) && !authToken) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.searchParams.set("redirectedFrom", pathname); // Optional: Redirect back after login
		return NextResponse.redirect(url);
	}

	// If trying to access login page while authenticated, redirect to dashboard
	if (isAuthRoute && authToken) {
		const url = request.nextUrl.clone();
		url.pathname = "/"; // Redirect to main dashboard
		return NextResponse.redirect(url);
	}

	// --- RBAC Check (Basic Example - Requires Role Info) ---
	// This middleware runs *before* AuthContext is available.
	// For strict RBAC here, you'd need:
	// 1. Include role in the auth token (Firebase Custom Claims).
	// 2. Or, make an API call here to check the role (adds latency).
	// A common pattern is to handle RBAC *within* the layout/page components using AuthContext
	// after the initial auth check here. This middleware prevents unauthenticated access.
	// For now, we'll assume the admin layout/page will handle the role check.

	// Allow the request to proceed if none of the above conditions are met
	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public assets (e.g., /placeholder-logo.svg)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|placeholder-logo.svg).*)",
	],
};

// --- IMPORTANT NOTES on Middleware Auth ---
// Storing the token in a cookie ('firebaseAuthToken' used as example) needs to be done securely
// (HttpOnly, Secure, SameSite=Strict) usually via a server-side mechanism (e.g., API route or server action)
// after successful Firebase client-side login. The client-side Firebase SDK manages its own token internally
// but doesn't automatically set a cookie suitable for middleware.
// A simpler approach for client-rendered apps is to handle redirects *client-side* using `useEffect` and `useRouter`
// within layouts/pages, checking the `useAuth` hook's state. The middleware then primarily protects against
// direct URL access before the client JS loads. Choose the approach that fits your security needs.
