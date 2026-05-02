export const mergeItems = (existing, incoming) => {
  return {
    ...existing,

    title: existing.title || incoming.title,
    slug: existing.slug || incoming.slug,

    poster: existing.poster || incoming.poster,
    platform: incoming.platform || existing.platform,
    genre: existing.genre || incoming.genre,

    // signals (don’t overwrite user-driven metrics)
    views: existing.views || 0,
    watchlistCount: existing.watchlistCount || 0,
    posts: existing.posts || 0,

    tmdbMatched: existing.tmdbMatched || incoming.tmdbMatched,

    source: existing.source || incoming.source,
    lastUpdated: Date.now()
  };
};