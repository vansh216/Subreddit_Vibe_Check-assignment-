export default function SentimentChart({ summary }) {
  if (!summary) return null;

  const { positivePercent, neutralPercent, negativePercent } = summary;

  const segments = [
    { label: "Positive", percent: positivePercent, color: "bg-emerald-500" },
    { label: "Neutral", percent: neutralPercent, color: "bg-zinc-500" },
    { label: "Negative", percent: negativePercent, color: "bg-rose-500" },
  ];

  return (
    <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="mb-3 text-sm font-semibold text-zinc-300">Sentiment Breakdown</p>

      {/* Stacked bar */}
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-zinc-800">
        {segments.map(
          (seg) =>
            seg.percent > 0 && (
              <div
                key={seg.label}
                className={`${seg.color} h-full transition-all`}
                style={{ width: `${seg.percent}%` }}
                title={`${seg.label}: ${seg.percent}%`}
              />
            )
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${seg.color}`} />
            <span className="text-zinc-400">
              {seg.label} <span className="font-medium text-zinc-200">{seg.percent}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}