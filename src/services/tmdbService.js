import { getCache, setCache } from "./cacheService";

// 🔐 Load from environment
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const searchTMDB = async (title) => {
  if (!title) return null;

  const key = `tmdb_${title.toLowerCase().trim()}`;

  // 🔥 Check cache first
  const cached = await getCache(key);
  if (cached) return cached;

  try {
    // ⚠️ Safety check
    if (!API_KEY) {
      console.error("TMDB API key missing");
      return null;
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        title
      )}`
    );

    if (!res.ok) {
      console.error("TMDB API error:", res.status);
      return null;
    }

    const data = await res.json();

    const result = data.results?.[0] || null;

    // 🔥 Cache result (even null to avoid repeated calls)
    await setCache(key, result);

    return result;
  } catch (error) {
    console.error("TMDB fetch error:", error);
    return null;
  }
};
