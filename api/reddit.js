// api/reddit.js
// Requires two environment variables set in your Vercel project:
//   REDDIT_CLIENT_ID
//   REDDIT_CLIENT_SECRET
//
// Frontend calls: /api/reddit?subreddit=technology&limit=50

let cachedToken = null;
let cachedTokenExpiry = 0;

async function getAccessToken() {
  // Reuse the token until it's close to expiring, instead of requesting
  // a new one on every single request.
  if (cachedToken && Date.now() < cachedTokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing REDDIT_CLIENT_ID or REDDIT_CLIENT_SECRET environment variables.");
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const tokenResponse = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "web:subreddit-vibe-check:1.0 (by /u/vibecheck_dev)",
    },
    body: "grant_type=client_credentials",
  });

  if (!tokenResponse.ok) {
    const text = await tokenResponse.text();
    throw new Error(`Failed to get Reddit access token (${tokenResponse.status}): ${text.slice(0, 200)}`);
  }

  const tokenData = await tokenResponse.json();
  cachedToken = tokenData.access_token;
  // expires_in is in seconds; refresh a bit early (60s buffer)
  cachedTokenExpiry = Date.now() + (tokenData.expires_in - 60) * 1000;

  return cachedToken;
}

export default async function handler(req, res) {
  const { subreddit, limit = "50" } = req.query;

  if (!subreddit || !subreddit.trim()) {
    return res.status(400).json({ error: "Missing subreddit parameter." });
  }

  const cleanSubreddit = subreddit.trim().replace(/^r\//i, "");

  try {
    const accessToken = await getAccessToken();

    const redditUrl = `https://oauth.reddit.com/r/${cleanSubreddit}/hot?limit=${limit}&raw_json=1`;

    const redditResponse = await fetch(redditUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "web:subreddit-vibe-check:1.0 (by /u/vibecheck_dev)",
      },
    });

    const rawText = await redditResponse.text();

    if (!redditResponse.ok) {
      return res.status(redditResponse.status).json({
        error: `Reddit responded with status ${redditResponse.status}`,
        details: rawText.slice(0, 300),
      });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return res.status(502).json({
        error: "Reddit returned an unexpected (non-JSON) response.",
        details: rawText.slice(0, 300),
      });
    }

    const childrenCount = data?.data?.children?.length ?? 0;
    if (childrenCount === 0) {
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