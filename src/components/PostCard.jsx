/**
 * @param {object} post - a single post object with a `.sentiment` field attached
 *   { id, title, score, numComments, author, url, sentiment: { label, score, comparative } }
 */
export default function PostCard({ post }) {
  const { title, score, numComments, author, url, sentiment } = post;

  const tagStyles = {
    positive: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    negative: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    neutral: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  };

  const tagEmoji = {
    positive: "🙂",
    negative: "☹️",
    neutral: "😐",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900
                 p-4 transition hover:border-zinc-700 hover:bg-zinc-800/60"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm text-zinc-100 sm:text-[15px]">{title}</p>
        <p className="mt-1 text-xs text-zinc-500">
          u/{author} · ▲ {score} · 💬 {numComments}
        </p>
      </div>

      <span
        className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium
                    ${tagStyles[sentiment.label]}`}
      >
        {tagEmoji[sentiment.label]} {sentiment.label}
      </span>
    </a>
  );
}