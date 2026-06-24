import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
    const user = await currentUser();

    if (user) {
        const email =
            user.primaryEmailAddress?.emailAddress ||
            user.emailAddresses[0]?.emailAddress;

        if (!email) {
            return null;
        }

        const existingUserById = await prisma.user.findUnique({
            where: { id: user.id },
            select: { id: true, email: true },
        });

        if (existingUserById) {
            if (existingUserById.email !== email) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { email },
                });
            }
        } else {
            const existingUserByEmail = await prisma.user.findUnique({
                where: { email },
                select: { id: true },
            });

            if (existingUserByEmail) {
                await prisma.user.update({
                    where: { email },
                    data: { id: user.id },
                });
            } else {
                await prisma.user.create({
                    data: {
                        id: user.id,
                        email,
                    },
                });
            }
        }
    }

    return user;
}
