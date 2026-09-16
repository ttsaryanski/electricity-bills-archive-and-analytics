"use server";

import { Prisma } from "@prisma/client";

import {
    createUserRepo,
    getUsersCount,
    updateUserRepo,
} from "@/repositories/user.repository";
import { registeredUsersGauge } from "@/lib/observability/metrics";

export async function syncUser(userId: string, email: string) {
    try {
        await createUserRepo(userId, email);

        try {
            const usersCount = await getUsersCount();
            registeredUsersGauge.set(usersCount);
        } catch (error) {
            console.error("Failed to update registered users gauge:", error);
        }
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            await updateUserRepo(userId, email);
            return;
        }
        throw error;
    }
}
