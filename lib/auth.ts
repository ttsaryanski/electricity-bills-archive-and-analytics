import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { syncUser } from "@/services/user.services";

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
    await syncUser(userId, email);
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
