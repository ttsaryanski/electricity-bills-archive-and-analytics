import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
    const user = await stackServerApp.getUser();

    if (user) {
        await prisma.user.upsert({
            where: {
                id: user.id,
            },
            update: {},
            create: {
                id: user.id,
                email: user.primaryEmail as string,
            },
        });
    }

    return user;
}
