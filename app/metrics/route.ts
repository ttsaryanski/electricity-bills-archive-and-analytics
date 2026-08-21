import { NextResponse } from "next/server";

import { register, registeredUsersGauge } from "@/lib/observability/metrics";

import { getUsersCount } from "@/repositories/user.repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    const usersCount = await getUsersCount();
    registeredUsersGauge.set(usersCount);

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
