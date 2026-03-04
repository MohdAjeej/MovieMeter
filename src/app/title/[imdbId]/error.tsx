"use client";

export default function TitleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0c1012] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pb-24 pt-16 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="text-sm text-white/70">
          We couldn&apos;t load this title. Check the IMDb ID and your connection, then try again.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Back home
          </a>
        </div>
        <p className="mt-4 text-xs text-white/35">Debug info: {error.message}</p>
      </div>
    </div>
  );
}

