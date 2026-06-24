import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProductsPaginated } from "@/services/product.services";
import Pagination from "@/components/pagination";
import DeleteButton from "@/components/delete.button";

const InventoryPage = async ({
    searchParams,
}: {
    searchParams: { query?: string; page?: string };
}) => {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const params = await searchParams;
    const query = (params.query ?? "").trim();
    const page = Math.max(1, Number(params.page ?? 1));
    const pageSize = 5;

    const { totalCount, products } = await getProductsPaginated(
        query,
        page,
        pageSize,
    );
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Inventory
                            </h1>
                            <p className="text-sm text-gray-500">
                                Manage your products and track inventory levels.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Search */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <form
                            className="flex gap-2"
                            action="/inventory"
                            method="GET"
                        >
                            <input
                                name="query"
                                placeholder="Search products..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                            />
                            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        SKU
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Low Stock At
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product, key) => (
                                    <tr key={key} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4  text-sm text-gray-500">
                                            {product.sku || "-"}
                                        </td>
                                        <td className="px-6 py-4  text-sm text-gray-900">
                                            ${Number(product.price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4  text-sm text-gray-900">
                                            {product.quantity}
                                        </td>
                                        <td className="px-6 py-4  text-sm text-gray-500">
                                            {product.lowStockAt || "-"}
                                        </td>
                                        <td className="px-6 py-4  text-sm text-gray-500">
                                            <DeleteButton id={product.id} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                baseUrl="/inventory"
                                searchParams={{
                                    query,
                                    pageSize: String(pageSize),
                                }}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default InventoryPage;
