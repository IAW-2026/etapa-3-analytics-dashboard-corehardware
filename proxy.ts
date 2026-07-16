import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/pedidos(.*)",
    "/finanzas(.*)",
    "/logistica(.*)",
    "/usuarios(.*)",
    "/ventas(.*)",
    "/productos(.*)",
]);

const isApiRoute = createRouteMatcher(["/api(.*)"]);

function isRole(value: unknown): value is string {
    return typeof value === "string";
}

function canAccess(role: string): boolean {
    return role === "admin";
}

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();
    const rawRole = sessionClaims?.metadata?.role;

    // Rutas de API: nunca redirigir a páginas. Responder JSON y dejar pasar
    // si el usuario está autorizado, o cortar con 401/403 si no.
    if (isApiRoute(req)) {
        if (!userId) {
            return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        }
        if (!isRole(rawRole) || !canAccess(rawRole)) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 });
        }
        return NextResponse.next();
    }

    if (req.nextUrl.pathname === "/unauthorized") {
        if (!userId) return NextResponse.redirect(new URL("/", req.url));

        if (isRole(rawRole) && canAccess(rawRole)) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    }

    if (isProtectedRoute(req)) {
        if (!userId) {
            const signInUrl = new URL("/sign-in", req.url);
            signInUrl.searchParams.set("redirect_url", req.url);
            return NextResponse.redirect(signInUrl);
        }

        if (!isRole(rawRole) || !canAccess(rawRole)) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        return NextResponse.next();
    }

    if (userId) {
        if (isRole(rawRole) && canAccess(rawRole)) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
});

export const config = {
    matcher: [
        '/((?!_next|api/cron(?:/|$)|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/__clerk/(.*)',
        '/((?!api/cron(?:/|$))(?:api|trpc).*)',
    ],
};