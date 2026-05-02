import { fetchRSS } from "./rssService";
import { normalizeRSS } from "./normalizeService";
import { searchTMDB } from "./tmdbService";
import { getWatchmodeSources } from "./watchmodeService";
import { saveItems } from "./dataService";
import { findDuplicate } from "./matchService";
import { mergeItems } from "./mergeService";
import { getConfidence } from "./scoringService";

import { normalizeTitle } from "../utils";

const FALLBACK_POSTER =
  "https://via.placeholder.com/500x750?text=OTT+Pulse";

export const runIngestion = async () => {
  const rssItems = await fetchRSS();

  for (let raw of rssItems) {
    let item = normalizeRSS(raw);

    // 🔥 Canonical identity (MUST be early)
    item.slug = normalizeTitle(item.title);

    // 🔍 DUPLICATE CHECK (fast slug → fuzzy fallback)
    const existing = await findDuplicate(item.title);

    // -------------------------
    // 🔥 ENRICHMENT (only if needed)
    // -------------------------

    // TMDB
    const tmdb = await searchTMDB(item.title);
    if (tmdb) {
      item.poster = tmdb.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}`
        : item.poster;
      item.genre = tmdb.genre_ids?.[0] || item.genre;
      item.tmdbMatched = true;
    } else {
      item.tmdbMatched = false;
      item.poster = item.poster || FALLBACK_POSTER;
    }

    // Watchmode
    const platform = await getWatchmodeSources(item.title);
    if (platform) {
      item.platform = platform;
    }

    // 🔥 INDIA OVERRIDE (your edge)
    item.platform = overridePlatform(item);

    // Metadata
    item.lastUpdated = Date.now();

    // 🔥 CONFIDENCE SCORE (NEW CORE)
    item.confidence = getConfidence(item);

    // -------------------------
    // 🔁 MERGE OR CREATE
    // -------------------------
    if (existing) {
      const merged = mergeItems(existing, item);

      // recompute confidence after merge (important)
      merged.confidence = getConfidence(merged);

      await saveItems([merged]);
    } else {
      await saveItems([item]);
    }
  }
};

// 🔥 Your intelligence layer (expand over time)
const overridePlatform = (item) => {
  if (item.language === "bengali") return "hoichoi";
  if (item.language === "telugu") return "aha";
  if (item.language === "tamil") return "sunnxt";

  return item.platform || "unknown";
};
