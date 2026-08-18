// api/reddit.js
//
// Vercel serverless function.
//
// Tries live Reddit OAuth first (client_credentials flow). Reddit's new
// "Responsible Builder Policy" now requires manual approval for API
// access, so if credentials aren't approved yet, this falls back to a
// cached sample dataset stored in /sample-data so the app remains fully
// demonstrable end-to-end.
//
// The real OAuth code below is fully functional and will be used
// automatically the moment REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET are
// set to approved credentials — nothing else needs to change.

import fs from "fs";
import path from "path";

let cachedToken = null;
let cachedTokenExpiry = 0;

async function getAccessToken() {
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
    throw new Error(`Token request failed (${tokenResponse.status}): ${text.slice(0, 200)}`);
  }

  const tokenData = await tokenResponse.json();
  cachedToken = tokenData.access_token;
  cachedTokenExpiry = Date.now() + (tokenData.expires_in - 60) * 1000;

  return cachedToken;
}

async function fetchLiveFromReddit(cleanSubreddit, limit) {
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
    throw new Error(`Reddit responded with status ${redditResponse.status}: ${rawText.slice(0, 200)}`);
  }

  const data = JSON.parse(rawText);

  const childrenCount = data?.data?.children?.length ?? 0;
  if (childrenCount === 0) {
    throw new Error("Reddit returned an empty post listing.");
  }

  return data;
}

function loadSampleData(cleanSubreddit) {
  const filePath = path.join(process.cwd(), "sample-data", `${cleanSubreddit.toLowerCase()}-hot.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export default async function handler(req, res) {
  const { subreddit, limit = "50" } = req.query;

  if (!subreddit || !subreddit.trim()) {
    return res.status(400).json({ error: "Missing subreddit parameter." });
  }

  const cleanSubreddit = subreddit.trim().replace(/^r\//i, "");

  // 1. Try live Reddit OAuth first
  try {
    const liveData = await fetchLiveFromReddit(cleanSubreddit, limit);
    return res.status(200).json({ ...liveData, _source: "live" });
  } catch (liveError) {
    // 2. Fall back to cached sample data if live fetch fails
    const sampleData = loadSampleData(cleanSubreddit);

    if (sampleData) {
      return res.status(200).json({ ...sampleData, _source: "cached_sample" });
    }

    return res.status(502).json({
      error: `No live or cached data available for r/${cleanSubreddit}.`,
      details: liveError.message,
    });
  }
}