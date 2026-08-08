"use client";

import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="m-auto mt-6 w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
                Something went wrong
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-gray-900">
                We could not load this page
            </h1>
            <p className="mt-4 text-sm leading-6 text-gray-600">
                {error.message || "An unexpected error occurred."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={reset}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                    Try again
                </button>
                <Link
                    href="/address"
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Go to Address
                </Link>
            </div>
        </div>
    );
}
