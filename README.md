# 📊 Subreddit Vibe Check

A dashboard that fetches the top 50 "Hot" posts from any subreddit and runs client-side sentiment analysis on the post titles — showing whether the community's current mood is Positive, Negative, or Neutral.

Built for the Full Stack Developer Internship take-home assignment.

---

## 🚀 Features

- Search any public subreddit by name
- Fetches the top 50 "Hot" posts using Reddit's public read-only JSON API (no login/API key required)
- Client-side sentiment analysis on all 50 post titles
- Overall "vibe" summary (Positive / Neutral / Negative) with a visual breakdown
- Individual post list with per-title sentiment tags
- Loading and error states (e.g. invalid subreddit, network issues)
- Fully responsive UI

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| Vite | 8.x | Build tool / dev server |
| Tailwind CSS | 4.3.x | Styling |
| Axios | 1.x | HTTP requests to Reddit API |
| sentiment | 5.x | Client-side sentiment scoring |
| Node.js | 18+ (20 recommended) | Local dev environment |

---

## 📁 Folder Structure

```
subreddit-vibe-check/
├── index.html               # HTML entry point
├── package.json             # Project dependencies & scripts
├── vite.config.js           # Vite + Tailwind plugin config
├── .gitignore
├── README.md
│
├── public/
│   └── favicon.svg
│
└── src/
    ├── main.jsx              # React app entry point
    ├── App.jsx                # Root component / page layout
    ├── index.css              # Tailwind import
    │
    ├── components/
    │   ├── SearchBar.jsx       # Subreddit input + submit button
    │   ├── VibeSummary.jsx     # Overall mood card (emoji + %)
    │   ├── SentimentChart.jsx  # Visual breakdown of pos/neg/neutral
    │   ├── PostList.jsx        # Renders list of 50 posts
    │   ├── PostCard.jsx        # Single post title + sentiment tag
    │   └── LoadingState.jsx    # Spinner / skeleton loader
    │
    ├── hooks/
    │   └── useSubredditData.js # Custom hook: fetch + analyze logic
    │
    ├── services/
    │   └── redditApi.js        # Axios call to Reddit's hot.json endpoint
    │
    └── utils/
        └── sentimentAnalyzer.js # Wraps `sentiment` lib + aggregates scores
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher installed (`node -v` to check)

### Installation

```bash
# Clone the repository
git clone <https://github.com/vansh216/Subreddit_Vibe_Check-assignment-.git>
cd subreddit-vibe-check

# Install dependencies
npm install
```

### Run locally

```bash
npm run dev
```

App will be available at `http://localhost:5173`

### Build for production

```bash
npm run build
```

Output goes to the `dist/` folder, ready to deploy.

---

## 🌐 How It Works

1. **User input** — Enter a subreddit name (e.g. `technology`) in the search bar.
2. **Data fetching** — The app calls `https://www.reddit.com/r/{subreddit}/hot.json?limit=50` to get the top 50 hot posts.
3. **Sentiment analysis** — Each post title is scored client-side using the `sentiment` library.
4. **Results display** — The app aggregates all scores into an overall vibe summary and shows a per-post breakdown.


## 📄 License

Built as part of a technical assessment. Free to use for learning purposes.