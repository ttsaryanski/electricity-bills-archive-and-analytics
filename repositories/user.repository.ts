import { prisma } from "@/lib/prisma";

export async function createUserRepo(userId: string, email: string) {
    await prisma.user.upsert({
        where: { id: userId },
        update: { email },
        create: { id: userId, email },
    });

    return { success: true, message: "User created successfully" };
}

export async function updateUserRepo(userId: string, email: string) {
    await prisma.user.update({
        where: { email },
        data: { id: userId },
    });

    return { success: true, message: "User updated successfully" };
}
