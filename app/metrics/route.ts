import { NextResponse } from "next/server";

import { register } from "@/lib/observability/metrics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    const body = await register.metrics();

    return new NextResponse(body, {
        status: 200,
        headers: {
            "Content-Type": register.contentType,
            "Cache-Control":
                "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
        },
    });
}
