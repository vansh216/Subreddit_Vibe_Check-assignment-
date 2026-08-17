import axios from "axios";

/**
 * @param {string} subreddit - subreddit name without "r/" (e.g. "technology")
 * @param {number} limit - number of posts to fetch (default 50)
 * @returns {Promise<Array>} array of simplified post objects
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

    if (children.length === 0) {
      throw new Error(`No posts found for r/${cleanSubreddit}. It may be empty, private, or banned.`);
    }

    return children.map((child) => ({
      id: child.data.id,
      title: child.data.title,
      score: child.data.score,
      numComments: child.data.num_comments,
      author: child.data.author,
      url: `https://reddit.com${child.data.permalink}`,
    }));
  } catch (error) {
    // Our own /api/reddit function returns { error, details } on failure —
    // surface that real reason instead of a generic message.
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