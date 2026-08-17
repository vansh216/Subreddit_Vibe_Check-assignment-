export default function VibeSummary({ subreddit, summary }) {
  if (!summary) return null;

  const {
    overallEmoji,
    overallLabel,
    totalPosts,
    positivePercent,
    negativePercent,
    neutralPercent,
    averageScore,
  } = summary;

  const labelColors = {
    positive: "text-emerald-400",
    negative: "text-rose-400",
    neutral: "text-zinc-400",
  };

  return (
    <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
      <p className="text-sm font-medium text-zinc-500">
        r/{subreddit} · {totalPosts} hot posts analyzed
      </p>

      <div className="mt-3 flex items-center gap-4">
        <span className="text-5xl sm:text-6xl">{overallEmoji}</span>
        <div>
          <p className={`text-2xl font-bold capitalize sm:text-3xl ${labelColors[overallLabel]}`}>
            {overallLabel} Vibe
          </p>
          <p className="text-sm text-zinc-500">avg. sentiment score: {averageScore}</p>
        </div>
      </div>

      {/* Quick breakdown row */}
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-zinc-800/60 py-3">
          <p className="text-lg font-bold text-emerald-400">{positivePercent}%</p>
          <p className="text-xs text-zinc-500">Positive</p>
        </div>
        <div className="rounded-xl bg-zinc-800/60 py-3">
          <p className="text-lg font-bold text-zinc-300">{neutralPercent}%</p>
          <p className="text-xs text-zinc-500">Neutral</p>
        </div>
        <div className="rounded-xl bg-zinc-800/60 py-3">
          <p className="text-lg font-bold text-rose-400">{negativePercent}%</p>
          <p className="text-xs text-zinc-500">Negative</p>
        </div>
      </div>
    </div>
  );
}