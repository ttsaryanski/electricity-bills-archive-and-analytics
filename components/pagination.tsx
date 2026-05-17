import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    searchParams: Record<string, string>;
}

const Pagination = ({
    currentPage,
    totalPages,
    baseUrl,
    searchParams,
}: PaginationProps) => {
    if (totalPages <= 1) return null;

    const getPageUrl = (page: number) => {
        const params = new URLSearchParams({
            ...searchParams,
            page: String(page),
        });
        return `${baseUrl}?${params.toString()}`;
    };

    return (
        <nav className="flex items-center justify-center gap-1">
            <Link
                href={getPageUrl(currentPage - 1)}
                className={`flex items-center px-3 py-2 text-sm font-meium rounded-lg ${
                    currentPage <= 1
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
                }`}
                aria-disabled={currentPage <= 1}
            >
                <ChevronLeft /> Prev
            </Link>

            <span className="px-3 py-2 text-sm font-medium rounded-lg bg-purple-600 text-white">
                page {currentPage} of {totalPages}
            </span>

            <Link
                href={getPageUrl(currentPage + 1)}
                className={`flex items-center px-3 py-2 text-sm font-meium rounded-lg ${
                    currentPage >= totalPages
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
                }`}
                aria-disabled={currentPage >= totalPages}
            >
                Next
                <ChevronRight />
            </Link>
        </nav>
    );
};

export default Pagination;
