import { useState, useCallback } from "react";
import { fetchHotPosts } from "../services/redditApi";
import { analyzeSentiment, aggregateSentiment } from "../utils/sentimentAnalyzer";


export function useSubredditData() {
  const [posts, setPosts] = useState([]);       
  const [summary, setSummary] = useState(null);  
  const [subreddit, setSubreddit] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeSubreddit = useCallback(async (subredditName) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch raw posts from Reddit
      const rawPosts = await fetchHotPosts(subredditName, 50);

      // 2. Run sentiment analysis on each post title
      const postsWithSentiment = rawPosts.map((post) => ({
        ...post,
        sentiment: analyzeSentiment(post.title),
      }));

      // 3. Aggregate into an overall vibe summary
      const overallSummary = aggregateSentiment(postsWithSentiment);

      setPosts(postsWithSentiment);
      setSummary(overallSummary);
      setSubreddit(subredditName.trim().replace(/^r\//i, ""));
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setPosts([]);
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPosts([]);
    setSummary(null);
    setSubreddit("");
    setError(null);
  }, []);

  return {
    posts,
    summary,
    subreddit,
    isLoading,
    error,
    analyzeSubreddit,
    reset,
  };
}