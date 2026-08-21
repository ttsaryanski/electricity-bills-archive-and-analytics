"use server";

import { Prisma } from "@prisma/client";

import { createUserRepo, updateUserRepo } from "@/repositories/user.repository";

export async function syncUser(userId: string, email: string) {
    try {
        await createUserRepo(userId, email);
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
