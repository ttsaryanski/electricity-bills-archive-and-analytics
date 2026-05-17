import { getCurrentUser } from "@/lib/auth";
import { getDashboardStats } from "@/lib/product/product.stats";
import { getWeeklyProductsData } from "@/lib/product/product.analytics";
import {
    getAllProductsCountWithQuery,
    getAllProductsWithQuery,
    deleteProductById,
} from "@/repositories/product.repository";
import { redirect } from "next/navigation";

let user;
export async function getDashboardData() {
    user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const [stats, weeklyProductsData] = await Promise.all([
        getDashboardStats(user.id),
        getWeeklyProductsData(user.id),
    ]);

    return {
        stats,
        weeklyProductsData,
    };
}

export async function getProductsPaginated(
    query: string,
    page: number,
    pageSize: number,
) {
    user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const where = {
        userId: user.id,
        ...(query
            ? { name: { contains: query, mode: "insensitive" as const } }
            : {}),
    };
    const totalCount = await getAllProductsCountWithQuery(where);
    const products = await getAllProductsWithQuery(where, page, pageSize);

    return {
        totalCount,
        products,
    };
}

export async function deleteProduct(formData: FormData) {
    user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const productId = formData.get("id") as string;
    if (!productId) {
        throw new Error("Product ID is required");
    }

    //if (confirm("Are you sure you want to delete this product?")) {
    await deleteProductById(productId, user.id);
    // } else {
    //     // If the user cancels the deletion, we can simply return without doing anything.
    //     return;
    // }
}
