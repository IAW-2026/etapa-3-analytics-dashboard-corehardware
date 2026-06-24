import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";


const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
]);


function isRole(value: unknown): value is String {
  return typeof value === "string"
}


function canAccess(role: String): boolean {
  return role == "admin";
}


export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();

    if (isProtectedRoute(req)) {
        if (!userId) {
            const signInUrl = new URL("/sign-in", req.url);
            signInUrl.searchParams.set("redirect_url", req.url);
            return NextResponse.redirect(signInUrl);
        } else {
            const client = await clerkClient();
            const user = await client.users.getUser(userId);
            const rawRole = user.publicMetadata?.role;

            if (!isRole(rawRole)) {
                return new NextResponse("Forbidden", { status: 403 });
            }

            if (!canAccess(rawRole)) {
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }

            return NextResponse.next();
        }
    }
    
    if (userId) {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const rawRole = user.publicMetadata?.role;
        
        if (!isRole(rawRole)) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
});


export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for Clerk's auto-proxy path
        '/__clerk/(.*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};