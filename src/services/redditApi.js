import axios from "axios";

/**
 * Fetches the top "Hot" posts from a given subreddit using
 * Reddit's public, read-only JSON endpoint (no login/API key required).
 *
 * @param {string} subreddit - subreddit name without "r/" (e.g. "technology")
 * @param {number} limit - number of posts to fetch (default 50)
 * @returns {Promise<Array>} array of simplified post objects
 */
export async function fetchHotPosts(subreddit, limit = 50) {
  if (!subreddit || !subreddit.trim()) {
    throw new Error("Please enter a subreddit name.");
  }

  const cleanSubreddit = subreddit.trim().replace(/^r\//i, "");
  const url = `https://www.reddit.com/r/${cleanSubreddit}/hot.json?limit=${limit}`;

  try {
    const response = await axios.get(url);

    // Reddit wraps posts inside data.children, each with a nested "data" object
    const children = response.data?.data?.children ?? [];

    if (children.length === 0) {
      throw new Error(`No posts found for r/${cleanSubreddit}. It may be empty, private, or banned.`);
    }

    // Extract only the fields we actually need for the dashboard
    return children.map((child) => ({
      id: child.data.id,
      title: child.data.title,
      score: child.data.score,
      numComments: child.data.num_comments,
      author: child.data.author,
      url: `https://reddit.com${child.data.permalink}`,
    }));
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Subreddit "r/${cleanSubreddit}" does not exist.`);
    }
    if (error.response?.status === 403) {
      throw new Error(`r/${cleanSubreddit} is private or has been banned.`);
    }
    if (error.response?.status === 429) {
      throw new Error("Too many requests to Reddit right now. Please wait a moment and try again.");
    }
    if (error.message?.includes("Network Error")) {
      throw new Error("Network error — check your internet connection and try again.");
    }
    // Re-throw errors we created ourselves above (like "No posts found")
    throw error;
  }
}