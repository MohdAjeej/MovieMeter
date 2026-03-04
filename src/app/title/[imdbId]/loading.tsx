export default function LoadingTitle() {
  return (
    <div className="min-h-screen bg-[#0c1012] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-12 sm:px-6">
        <div className="h-4 w-24 rounded-full bg-white/10" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="aspect-[2/3] w-full rounded-2xl bg-white/10" />
            <div className="mt-4 h-10 rounded-2xl bg-white/10" />
            <div className="mt-2 h-10 rounded-2xl bg-white/10" />
          </div>
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="h-6 w-2/3 rounded-full bg-white/10" />
            <div className="mt-3 h-4 w-1/3 rounded-full bg-white/10" />
            <div className="mt-6 space-y-2">
              <div className="h-3 w-full rounded-full bg-white/10" />
              <div className="h-3 w-5/6 rounded-full bg_white/10" />
              <div className="h-3 w-2/3 rounded-full bg_white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

