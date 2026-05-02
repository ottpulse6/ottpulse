import { getCache, setCache } from "./cacheService";

// 🔐 Load from environment
const API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;

export const getWatchmodeSources = async (title) => {
  if (!title) return null;

  const key = `watch_${title.toLowerCase().trim()}`;

  // 🔥 Check cache first
  const cached = await getCache(key);
  if (cached !== null) return cached;

  try {
    // ⚠️ Safety check
    if (!API_KEY) {
      console.error("Watchmode API key missing");
      return null;
    }

    // 🔍 Step 1: Search title
    const res = await fetch(
      `https://api.watchmode.com/v1/search/?apiKey=${API_KEY}&search_field=name&search_value=${encodeURIComponent(
        title
      )}`
    );

    if (!res.ok) {
      console.error("Watchmode search error:", res.status);
      return null;
    }

    const data = await res.json();

    if (!data.title_results?.length) {
      await setCache(key, null); // 🔥 cache miss
      return null;
    }

    const id = data.title_results[0].id;

    // 📺 Step 2: Get sources
    const srcRes = await fetch(
      `https://api.watchmode.com/v1/title/${id}/sources/?apiKey=${API_KEY}&regions=IN`
    );

    if (!srcRes.ok) {
      console.error("Watchmode sources error:", srcRes.status);
      return null;
    }

    const sources = await srcRes.json();

    const platform = sources?.[0]?.name?.toLowerCase() || null;

    // 🔥 Cache result (even null)
    await setCache(key, platform);

    return platform;
  } catch (error) {
    console.error("Watchmode fetch error:", error);
    return null;
  }
};
