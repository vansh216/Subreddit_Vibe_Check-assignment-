export default function LoadingState() {
  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 py-12">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-[#FF4500]"
        role="status"
        aria-label="Loading"
      />
      <p className="text-sm text-zinc-400">
        Fetching hot posts and checking the vibe...
      </p>
    </div>
  );
}