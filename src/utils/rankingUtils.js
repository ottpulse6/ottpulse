import { getPulseScore } from "../services/pulseService";

// 🔥 Freshness Boost
const getFreshnessBoost = (item) => {
  const now = Date.now();

  const date = item.releaseDate
    ? new Date(item.releaseDate).getTime()
    : item.lastUpdated || now;

  const ageInDays = (now - date) / (1000 * 60 * 60 * 24);

  if (ageInDays <= 2) return 1.5;
  if (ageInDays <= 7) return 1.3;
  if (ageInDays <= 30) return 1.1;
  if (ageInDays <= 90) return 0.9;
  return 0.7;
};

// 🔥 FINAL SCORE (Trending)
export const getFinalScore = (item) => {
  const pulse = getPulseScore(item.id);
  const confidence = item.confidence || 0.5;
  const freshness = getFreshnessBoost(item);

  return pulse * confidence * freshness;
};

// 📈 Rising Score (Momentum-based)
export const getRisingScore = (item) => {
  const pulse = getPulseScore(item.id);
  const confidence = item.confidence || 0.5;

  const now = Date.now();
  const date = item.releaseDate
    ? new Date(item.releaseDate).getTime()
    : item.lastUpdated || now;

  const ageInDays = (now - date) / (1000 * 60 * 60 * 24);

  const recencyBoost =
    ageInDays <= 3 ? 1.5 :
    ageInDays <= 7 ? 1.3 :
    ageInDays <= 14 ? 1.1 :
    0.8;

  return pulse * confidence * recencyBoost;
};