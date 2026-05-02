import rssService from './rssService.js';
import tmdbService from './tmdbService.js';
import watchmodeService from './watchmodeService.js';
import scoringService from './scoringService.js';

/**
 * Main ingestion pipeline
 */
export async function runIngestion() {
  console.log("🚀 Starting ingestion pipeline...");

  // 1. Fetch RSS feeds
  const rssItems = await rssService.fetchFeeds();

  if (!rssItems || rssItems.length === 0) {
    console.log("⚠️ No RSS items found");
    return [];
  }

  console.log(`📰 RSS items fetched: ${rssItems.length}`);

  const results = [];

  // 2. Process each item safely
  for (const item of rssItems) {
    try {
      console.log(`➡️ Processing: ${item.title}`);

      // 3. TMDB enrichment
      const tmdbData = await tmdbService.search(item.title);

      if (!tmdbData) {
        console.log(`⚠️ No TMDB match for: ${item.title}`);
        continue;
      }

      // 4. Watchmode availability
      let watchData = null;
      try {
        watchData = await watchmodeService.getAvailability(tmdbData.id);
      } catch (err) {
        console.log(`⚠️ Watchmode failed for ${item.title}`);
      }

      // 5. Scoring
      const score = scoringService.calculate({
        rss: item,
        tmdb: tmdbData,
        watch: watchData
      });

      // 6. Final object
      const enrichedItem = {
        id: tmdbData.id || item.guid || item.title,
        title: item.title,
        source: item.source,
        publishedAt: item.pubDate,

        tmdb: tmdbData,
        watch: watchData,
        score,

        createdAt: new Date().toISOString()
      };

      results.push(enrichedItem);

    } catch (err) {
      console.error(`❌ Failed item: ${item.title}`, err.message);
      continue; // do not break pipeline
    }
  }

  console.log(`✅ Ingestion complete: ${results.length} items processed`);

  return results;
}
