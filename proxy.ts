import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/add-bill(.*)",
    "/bills(.*)",
    "/address(.*)",
]);

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const hits = new Map<string, { count: number; resetAt: number }>();

function getClientKey(req: Request) {
    const forwardedFor = req.headers.get("x-forwarded-for");
    return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(req: Request) {
    const key = getClientKey(req);
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
        hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return false;
    }

    entry.count += 1;
    return entry.count > MAX_REQUESTS;
}

export default clerkMiddleware(async (auth, req) => {
    if (isRateLimited(req)) {
        return NextResponse.json(
            { error: "Too many requests" },
            { status: 429 },
        );
    }

    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
