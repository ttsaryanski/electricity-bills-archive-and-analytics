import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type AuthUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

function getUserEmail(user: Awaited<ReturnType<typeof currentUser>>) {
    if (!user) {
        return null;
    }

    return (
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses[0]?.emailAddress ||
        null
    );
}

async function syncAuthenticatedUser(userId: string, email: string) {
    try {
        await prisma.user.upsert({
            where: { id: userId },
            update: { email },
            create: { id: userId, email },
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            await prisma.user.update({
                where: { email },
                data: { id: userId },
            });
            return;
        }

        throw error;
    }
}

export async function getCurrentUser() {
    const user = await currentUser();
    if (!user) {
        return null;
    }

    const email = getUserEmail(user);
    if (!email) {
        return user;
    }

    await syncAuthenticatedUser(user.id, email);
    return user;
}

export async function requireCurrentUser(): Promise<AuthUser> {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in");
    }

    return user;
}
