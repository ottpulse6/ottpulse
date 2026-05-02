export const getConfidence = (item) => {
  let score = 0;

  // 🔥 Strong signal: TMDB match
  if (item.tmdbMatched) score += 0.4;

  // 🔥 Platform known (very important for OTT)
  if (item.platform && item.platform !== "unknown") score += 0.3;

  // 🔥 Visual completeness
  if (item.poster) score += 0.2;

  // 🔥 Source reliability (RSS = early signal, still useful)
  if (item.source === "rss") score += 0.1;

  // Clamp to [0,1]
  return Math.min(1, score);
};