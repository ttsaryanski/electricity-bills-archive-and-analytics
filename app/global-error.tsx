"use client";

import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-gray-950 px-6 py-12 text-gray-100 flex items-center justify-center">
                <div className="w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
                        Critical error
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-white">
                        The application encountered a fatal error
                    </h1>
                    <p className="mt-4 text-sm leading-6 text-gray-300">
                        {error.message ||
                            "Something went wrong at the root level."}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={reset}
                            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                        >
                            Retry
                        </button>
                        <Link
                            href="/"
                            className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-100 hover:bg-gray-800"
                        >
                            Go home
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
}
