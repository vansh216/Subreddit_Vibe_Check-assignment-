import SearchBar from "./components/SearchBar";
import VibeSummary from "./components/VibeSummary";
import SentimentChart from "./components/SentimentChart";
import PostList from "./components/PostList";
import LoadingState from "./components/LoadingState";
import { useSubredditData } from "./hooks/useSubredditData";

/**
 * Root component — page layout + wiring between the search input,
 * the data-fetching hook, and all result-display components.
 */
export default function App() {
  const { posts, summary, subreddit, source, isLoading, error, analyzeSubreddit } =
    useSubredditData();

  // Whether the user has searched at least once (controls empty-state message)
  const hasSearched = posts.length > 0 || isLoading || Boolean(error);

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 sm:py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="flex items-center gap-2 text-3xl font-extrabold text-zinc-50 sm:text-4xl">
            <span className="text-[#FF4500]">●</span> Subreddit Vibe Check
          </h1>
          <p className="max-w-sm text-sm text-zinc-500">
            Enter any subreddit to analyze the mood of its top 50 hot posts.
          </p>
        </div>

        {/* Search input */}
        <SearchBar onSearch={analyzeSubreddit} isLoading={isLoading} />

        {/* Error message */}
        {error && (
          <div className="w-full max-w-xl rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        {/* Loading state */}
        {isLoading && <LoadingState />}

        {/* Results */}
        {!isLoading && summary && (
          <>
            {source === "cached_sample" && (
              <div className="w-full max-w-xl rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
                Showing a cached sample dataset for r/{subreddit} — live Reddit API access is pending approval under Reddit's Responsible Builder Policy.
              </div>
            )}
            <VibeSummary subreddit={subreddit} summary={summary} />
            <SentimentChart summary={summary} />
            <PostList posts={posts} />
          </>
        )}

        {/* Empty state (before any search) */}
        {!hasSearched && (
          <p className="mt-4 text-sm text-zinc-600">
            Try something like{" "}
            <span className="font-medium text-zinc-400">technology</span>,{" "}
            <span className="font-medium text-zinc-400">funny</span>, or{" "}
            <span className="font-medium text-zinc-400">worldnews</span>.
          </p>
        )}
      </div>
    </div>
  );
}