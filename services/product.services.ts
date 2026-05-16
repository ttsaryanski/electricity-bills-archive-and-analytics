import { getCurrentUser } from "@/lib/auth";
import { getDashboardStats } from "@/lib/product/product.stats";
import { getWeeklyProductsData } from "@/lib/product/product.analytics";
import { redirect } from "next/navigation";

export async function getDashboardData() {
    const user = await getCurrentUser();
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
