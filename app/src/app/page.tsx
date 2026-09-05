import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-10 text-xs font-semibold tracking-[0.3em] text-text-dim">
        GRINDSTONE
      </div>

      <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-text sm:text-5xl">
        Stop &ldquo;trying to get consistent&rdquo; with DSA.
      </h1>
      <p className="mt-3 text-2xl font-medium text-accent">Just solve one.</p>

      <p className="mt-6 max-w-md text-balance text-text-dim">
        Grindstone turns every DSA session into a guided interview, coding
        round, and automatic review — without making you manage another
        dashboard.
      </p>

      <Link
        href="/today"
        className="mt-10 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-[#0b0c0f] transition-all hover:brightness-110 active:scale-[0.98]"
      >
        Start Today&rsquo;s Grind →
      </Link>

      <div className="mt-16 w-full max-w-xs rounded-2xl border border-border bg-surface p-5 text-left">
        <div className="text-sm text-text-dim">🔥 0 day streak</div>
        <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-text-dim">
          Today&rsquo;s session
        </div>
        <div className="mt-2 h-px bg-border" />
        <div className="mt-3 space-y-1 text-sm text-text">
          <div>1 problem</div>
          <div>1 pattern</div>
          <div>1 insight</div>
          <div className="text-text-dim">~20 minutes</div>
        </div>
      </div>

      <p className="mt-16 max-w-sm text-xs text-text-dim">
        No login. No planning. No note-taking. No figuring out what to
        practice. Open it. Start thinking.
      </p>
    </main>
  );
}
