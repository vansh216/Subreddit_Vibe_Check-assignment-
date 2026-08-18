import axios from "axios";

/**
 * Fetches the top "Hot" posts from a given subreddit via our own
 * serverless function at /api/reddit (see /api/reddit.js).
 *
 * That function tries live Reddit OAuth first, and falls back to a
 * cached sample dataset if live access isn't available (e.g. Reddit's
 * Responsible Builder Policy approval is still pending). The response
 * includes a `_source` field ("live" or "cached_sample") so the UI can
 * be transparent about which one was used.
 *
 * @param {string} subreddit - subreddit name without "r/" (e.g. "technology")
 * @param {number} limit - number of posts to fetch (default 50)
 * @returns {Promise<{ posts: Array, source: "live"|"cached_sample" }>}
 */
export async function fetchHotPosts(subreddit, limit = 50) {
  if (!subreddit || !subreddit.trim()) {
    throw new Error("Please enter a subreddit name.");
  }

  const cleanSubreddit = subreddit.trim().replace(/^r\//i, "");

  try {
    const response = await axios.get("/api/reddit", {
      params: { subreddit: cleanSubreddit, limit },
      timeout: 10000,
    });

    const children = response.data?.data?.children ?? [];
    const source = response.data?._source ?? "live";

    if (children.length === 0) {
      throw new Error(`No posts found for r/${cleanSubreddit}. It may be empty, private, or banned.`);
    }

    const posts = children.map((child) => ({
      id: child.data.id,
      title: child.data.title,
      score: child.data.score,
      numComments: child.data.num_comments,
      author: child.data.author,
      url: child.data.permalink?.startsWith("http")
        ? child.data.permalink
        : `https://reddit.com${child.data.permalink}`,
    }));

    return { posts, source };
  } catch (error) {
    const apiError = error.response?.data?.error;
    const apiDetails = error.response?.data?.details;

    if (apiError) {
      console.error("Reddit proxy error details:", apiDetails);
      throw new Error(apiError);
    }
    if (error.message?.startsWith("No posts found")) {
      throw error;
    }
    throw new Error("Couldn't reach the server. Please check your connection and try again.");
  }
}