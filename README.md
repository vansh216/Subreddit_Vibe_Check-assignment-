# 📊 Subreddit Vibe Check

A dashboard that fetches the top "Hot" posts from any subreddit and runs sentiment analysis on the post titles — showing whether the community's current mood is Positive, Negative, or Neutral.

Built for the Full Stack Developer Internship take-home assignment.

---

## 🚀 Features

- Search any subreddit by name
- Fetches the top "Hot" posts (up to 50) for that subreddit
- Client-side sentiment analysis on all post titles
- Overall "vibe" summary (Positive / Neutral / Negative) with a visual breakdown
- Individual post list with per-title sentiment tags
- Loading and error states (e.g. invalid subreddit, network issues)
- Fully responsive, Reddit-inspired dark UI

---

## ⚠️ A note on Reddit API access

While building this, I ran into Reddit's newer **Responsible Builder Policy**, which now requires manual, approval-gated access to their API — the old instant self-service developer registration no longer applies. I registered a script app and implemented the full OAuth `client_credentials` flow (see `api/reddit.js`), but live access requires Reddit's approval, which was not granted in time for the submission deadline.

**To keep the project fully demonstrable, `api/reddit.js` works like this:**
1. It first attempts a live authenticated request to Reddit's API via OAuth.
2. If that fails (e.g. pending approval, or a 403 from Reddit's anti-bot restrictions on cloud/datacenter IPs), it automatically falls back to a cached sample dataset stored in `/sample-data`, built in the same shape Reddit's real API returns.
3. The API response includes a `_source` field (`"live"` or `"cached_sample"`) so the UI can transparently show which one was used — the dashboard displays a visible note when sample data is active.

The entire fetch → sentiment analysis → display pipeline works identically regardless of data source, and the live-fetch code will activate automatically the moment approved credentials are available — no other code changes needed.

Sample datasets are currently included for: `technology`, `worldnews`, `funny`, `news`, `science`.

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| Vite | 8.x | Build tool / dev server |
| Tailwind CSS | 4.3.x | Styling |
| Axios | 1.x | HTTP requests |
| sentiment | 5.x | Client-side sentiment scoring |
| Node.js | 18+ (20 recommended) | Local dev / serverless runtime |
| Vercel Serverless Functions | — | Server-side Reddit OAuth + sample-data fallback |

---

## 📁 Folder Structure

```
subreddit-vibe-check/
├── index.html               # HTML entry point
├── package.json             # Project dependencies & scripts
├── vite.config.js           # Vite + Tailwind plugin config
├── vercel.json              # Ensures sample-data is bundled with the API function
├── .gitignore
├── README.md
│
├── api/
│   └── reddit.js            # Serverless function: OAuth attempt + sample-data fallback
│
├── sample-data/
│   ├── technology-hot.json
│   ├── worldnews-hot.json
│   ├── funny-hot.json
│   ├── news-hot.json
│   └── science-hot.json
│
├── public/
│   └── favicon.svg
│
└── src/
    ├── main.jsx                # React app entry point
    ├── App.jsx                 # Root component / page layout
    ├── index.css                # Tailwind import
    │
    ├── components/
    │   ├── SearchBar.jsx        # Subreddit input + submit button
    │   ├── VibeSummary.jsx      # Overall mood card (emoji + %)
    │   ├── SentimentChart.jsx   # Visual breakdown of pos/neg/neutral
    │   ├── PostList.jsx         # Renders list of posts
    │   ├── PostCard.jsx         # Single post title + sentiment tag
    │   └── LoadingState.jsx     # Spinner while fetching
    │
    ├── hooks/
    │   └── useSubredditData.js  # Fetch + analyze + state management
    │
    ├── services/
    │   └── redditApi.js         # Calls /api/reddit and normalizes the response
    │
    └── utils/
        └── sentimentAnalyzer.js # Wraps `sentiment` lib + aggregates scores
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (`node -v` to check)
- [Vercel CLI](https://vercel.com/docs/cli) — required, since this project uses a serverless API route (`npm i -g vercel`)

### Installation

```bash
git clone <https://github.com/vansh216/Subreddit_Vibe_Check-assignment-.git>
cd Subreddit_Vibe_Check-assignment-
npm install
```

### Run locally

This project uses a Vercel serverless function (`/api/reddit.js`), so **plain `npm run dev` (Vite alone) will not run the API route.** Use the Vercel CLI instead:

```bash
vercel dev
```

### Environment variables (optional — only needed for live Reddit access)

If you have approved Reddit API credentials, set these in your Vercel project (Settings → Environment Variables) or a local `.env`:

```
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
```

Without these, the app automatically uses the cached sample datasets.

### Build for production

```bash
npm run build
```

---

## 🌐 How It Works

1. **User input** — Enter a subreddit name (e.g. `technology`) in the search bar.
2. **Data fetching** — The frontend calls `/api/reddit?subreddit=...`, a serverless function that tries Reddit's OAuth API first, then falls back to cached sample data if needed.
3. **Sentiment analysis** — Each post title is scored client-side using the `sentiment` library.
4. **Results display** — The app aggregates all scores into an overall vibe summary, a visual breakdown chart, and a per-post list — with a note shown if sample data was used.

---

## 📦 Deployment

Deployed on [Vercel](https://vercel.com/), which supports both the static frontend and the `/api` serverless function out of the box.

---

## 📄 License

Built as part of a technical assessment. Free to use for learning purposes.