// api/reddit.js
//
// Vercel serverless function — runs server-side, not in the browser.
// This avoids CORS entirely and sends a proper User-Agent, which Reddit
// requires to avoid throttling/blocking the request.
//
// Uses old.reddit.com (rather than www.reddit.com), which is historically
// more permissive for unauthenticated JSON access, plus raw_json=1 so
// text isn't HTML-entity-encoded in the response.
//
// Frontend calls: /api/reddit?subreddit=technology&limit=50

export default async function handler(req, res) {
  const { subreddit, limit = "50" } = req.query;

  if (!subreddit || !subreddit.trim()) {
    return res.status(400).json({ error: "Missing subreddit parameter." });
  }

  const cleanSubreddit = subreddit.trim().replace(/^r\//i, "");
  const redditUrl = `https://old.reddit.com/r/${cleanSubreddit}/hot.json?limit=${limit}&raw_json=1`;

  try {
    const redditResponse = await fetch(redditUrl, {
      headers: {
        // Reddit's recommended User-Agent format: platform:app-id:version (by /u/username)
        "User-Agent": "web:subreddit-vibe-check:1.0 (by /u/vibecheck_dev)",
        Accept: "application/json",
      },
    });

    const rawText = await redditResponse.text();

    if (!redditResponse.ok) {
      return res.status(redditResponse.status).json({
        error: `Reddit responded with status ${redditResponse.status}`,
        details: rawText.slice(0, 300), // helps diagnose what Reddit actually sent back
      });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      // Reddit returned 200 but the body wasn't valid JSON (e.g. an HTML block page)
      return res.status(502).json({
        error: "Reddit returned an unexpected (non-JSON) response — likely a block or interstitial page.",
        details: rawText.slice(0, 300),
      });
    }

    const childrenCount = data?.data?.children?.length ?? 0;
    if (childrenCount === 0) {
      // Valid JSON, but genuinely no posts came back — surface Reddit's raw shape for debugging
      return res.status(502).json({
        error: "Reddit returned an empty post listing.",
        details: JSON.stringify(data).slice(0, 300),
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch from Reddit.", details: error.message });
  }
}