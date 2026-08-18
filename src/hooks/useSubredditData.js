import { useState, useCallback } from "react";
import { fetchHotPosts } from "../services/redditApi";
import { analyzeSentiment, aggregateSentiment } from "../utils/sentimentAnalyzer";

/**
 * Custom hook that ties together fetching, sentiment analysis, and
 * loading/error/result state for the UI.
 */
export function useSubredditData() {
  const [posts, setPosts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [subreddit, setSubreddit] = useState("");
  const [source, setSource] = useState(null); // "live" | "cached_sample" | null
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeSubreddit = useCallback(async (subredditName) => {
    setIsLoading(true);
    setError(null);

    try {
      const { posts: rawPosts, source: dataSource } = await fetchHotPosts(subredditName, 50);

      const postsWithSentiment = rawPosts.map((post) => ({
        ...post,
        sentiment: analyzeSentiment(post.title),
      }));

      const overallSummary = aggregateSentiment(postsWithSentiment);

      setPosts(postsWithSentiment);
      setSummary(overallSummary);
      setSubreddit(subredditName.trim().replace(/^r\//i, ""));
      setSource(dataSource);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setPosts([]);
      setSummary(null);
      setSource(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPosts([]);
    setSummary(null);
    setSubreddit("");
    setSource(null);
    setError(null);
  }, []);

  return {
    posts,
    summary,
    subreddit,
    source,
    isLoading,
    error,
    analyzeSubreddit,
    reset,
  };
}