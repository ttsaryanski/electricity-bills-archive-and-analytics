import { prisma } from "@/lib/prisma";

export async function getAllAddresses(userId: string) {
    return prisma.address.findMany({
        where: { userId },
    });
}

export async function getPrimaryAddress(userId: string) {
    return prisma.address.findFirst({
        where: { userId, isPrimary: true },
    });
}

export async function getDemoAddress() {
    return prisma.address.findFirst({
        where: { address: "Demo" },
        select: { address: true, id: true },
    });
}

export async function deleteAddressById(addressId: string, userId: string) {
    const address = await prisma.address.findFirst({
        where: { id: addressId, userId },
    });

    if (!address) {
        return {
            success: false,
            message: "Address not found",
        };
    }

    await prisma.address.delete({
        where: {
            id: addressId,
            userId,
        },
    });

    return {
        success: true,
        message: "Address deleted successfully",
    };
}

export async function createAddress(data: { address: string; userId: string }) {
    const existingAddress = await prisma.address.findFirst({
        where: { address: data.address, userId: data.userId },
    });

    if (existingAddress) {
        return { success: false, message: "Address already exists" };
    }

    const count = await prisma.address.count({
        where: { userId: data.userId },
    });
    await prisma.address.create({
        data: {
            ...data,
            isPrimary: count === 0,
        },
    });

    return { success: true, message: "Address created successfully" };
}

export async function setAddressPrimary(addressId: string, userId: string) {
    const address = await prisma.address.findFirst({
        where: { id: addressId, userId },
    });

    if (!address) {
        return {
            success: false,
            message: "Address not found",
        };
    }

    await prisma.$transaction(async (tx) => {
        await tx.address.updateMany({
            where: { userId, isPrimary: true },
            data: { isPrimary: false },
        });

        await tx.address.update({
            where: { id: addressId, userId },
            data: { isPrimary: true },
        });
    });

    return {
        success: true,
        message: "Address set as primary successfully",
    };
}
