"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && error?.digest) {
      console.error("[Error boundary]", error.message, { digest: error.digest });
    }
  }, [error]);

  return (
    <main
      className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <h1 className="text-4xl font-semibold tracking-tight mb-3">
        Something went wrong
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        We couldn’t load this page. Try again — if the problem continues, we’ve
        been notified and are looking into it.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-white font-medium transition shadow-md hover:opacity-90"
          style={{ background: "var(--accent-primary)" }}
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-medium border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition"
          style={{ color: "var(--foreground)" }}
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
