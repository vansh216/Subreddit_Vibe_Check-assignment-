import Sentiment from "sentiment";

const sentimentEngine = new Sentiment();

/**
 * @param {string} text - text to analyze (e.g. a Reddit post title)
 * @returns {{ label: "positive"|"negative"|"neutral", score: number, comparative: number }}
 */
export function analyzeSentiment(text) {
  const result = sentimentEngine.analyze(text || "");

  // result.comparative = score normalized by word count (better for comparing titles of different lengths)
  let label = "neutral";
  if (result.score > 0) label = "positive";
  else if (result.score < 0) label = "negative";

  return {
    label,
    score: result.score,
    comparative: result.comparative,
  };
}


//  Aggregates sentiment results across a list of posts
 
export function aggregateSentiment(postsWithSentiment) {
  const totalPosts = postsWithSentiment.length;

  if (totalPosts === 0) {
    return {
      totalPosts: 0,
      positiveCount: 0,
      negativeCount: 0,
      neutralCount: 0,
      positivePercent: 0,
      negativePercent: 0,
      neutralPercent: 0,
      averageScore: 0,
      overallLabel: "neutral",
      overallEmoji: "😐",
    };
  }

  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  let scoreSum = 0;

  for (const post of postsWithSentiment) {
    scoreSum += post.sentiment.score;
    if (post.sentiment.label === "positive") positiveCount++;
    else if (post.sentiment.label === "negative") negativeCount++;
    else neutralCount++;
  }

  const averageScore = scoreSum / totalPosts;

  let overallLabel = "neutral";
  let overallEmoji = "😐";
  if (averageScore > 0.15) {
    overallLabel = "positive";
    overallEmoji = "😊";
  } else if (averageScore < -0.15) {
    overallLabel = "negative";
    overallEmoji = "😠";
  }

  const toPercent = (count) => Math.round((count / totalPosts) * 100);

  return {
    totalPosts,
    positiveCount,
    negativeCount,
    neutralCount,
    positivePercent: toPercent(positiveCount),
    negativePercent: toPercent(negativeCount),
    neutralPercent: toPercent(neutralCount),
    averageScore: Number(averageScore.toFixed(2)),
    overallLabel,
    overallEmoji,
  };
}