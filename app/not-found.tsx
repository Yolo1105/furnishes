import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <h1 className="text-4xl font-semibold tracking-tight mb-3">
        Page not found
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-white font-medium transition shadow-md hover:opacity-90"
          style={{ background: "var(--accent-primary)" }}
        >
          Back to Home
        </Link>
        <Link
          href="/collections"
          className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-medium border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition"
          style={{ color: "var(--foreground)" }}
        >
          Browse collections
        </Link>
      </div>
    </main>
  );
}
