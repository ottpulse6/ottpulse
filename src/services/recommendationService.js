import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { getFinalScore } from "../utils/rankingUtils";

// 🔥 Interaction weights
const INTERACTION_WEIGHTS = {
  watchlist: 5,
  view: 3,
  click: 1
};

// 🔥 Build weighted user profile
const buildUserProfile = (userData) => {
  const profile = {
    genres: {},
    platforms: {},
    languages: {}
  };

  const interactions = userData?.interactions || [];

  interactions.forEach((item) => {
    const weight = INTERACTION_WEIGHTS[item.type] || 1;

    if (item.genre) {
      profile.genres[item.genre] =
        (profile.genres[item.genre] || 0) + weight;
    }

    if (item.platform) {
      profile.platforms[item.platform] =
        (profile.platforms[item.platform] || 0) + weight;
    }

    if (item.language) {
      profile.languages[item.language] =
        (profile.languages[item.language] || 0) + weight;
    }
  });

  return profile;
};

// 🔥 Match score (weighted relevance)
const getMatchScore = (item, profile) => {
  let score = 0;

  if (item.genre && profile.genres[item.genre]) {
    score += profile.genres[item.genre] * 2;
  }

  if (item.platform && profile.platforms[item.platform]) {
    score += profile.platforms[item.platform] * 1.5;
  }

  if (item.language && profile.languages[item.language]) {
    score += profile.languages[item.language] * 1.2;
  }

  return score;
};

// 🔥 MAIN FUNCTION
export const getRecommendations = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return [];

    const userData = userSnap.data();
    const profile = buildUserProfile(userData);

    // 🔹 Fetch content
    const snap = await getDocs(collection(db, "content"));
    const content = snap.docs.map((doc) => doc.data());

    // 🔥 Score everything
    const scored = content.map((item) => {
      const matchScore = getMatchScore(item, profile);
      const baseScore = getFinalScore(item);

      return {
        ...item,
        recommendationScore: baseScore + matchScore * 10
      };
    });

    // 🔥 Sort + return top
    return scored
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 10);

  } catch (error) {
    console.error("Recommendation error:", error);
    return [];
  }
};
