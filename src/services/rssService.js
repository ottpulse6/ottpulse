import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'OTT-Pulse/1.0'
  }
});

/**
 * Curated RSS sources (Film + OTT + Entertainment)
 */
const FEEDS = [
  { url: 'https://www.bollywoodhungama.com/rss/news.xml', source: 'Bollywood Hungama' },
  { url: 'https://www.hollywoodreporter.com/t/movies/feed/', source: 'Hollywood Reporter' },
  { url: 'https://variety.com/feed/', source: 'Variety' },
  { url: 'https://www.collider.com/feed/', source: 'Collider' }
];

/**
 * Clean title for better TMDB matching
 */
function cleanTitle(title) {
  if (!title) return '';

  return title
    .replace(/\(.*?\)/g, '')          // remove brackets
    .replace(/\[.*?\]/g, '')          // remove square brackets
    .replace(/[:|–-].*$/g, '')        // remove trailing descriptions
    .replace(/[^a-zA-Z0-9\s]/g, '')   // remove special chars
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Basic deduplication key
 */
function generateId(item) {
  return (
    item.guid ||
    item.link ||
    cleanTitle(item.title).toLowerCase()
  );
}

/**
 * Fetch and normalize all RSS feeds
 */
async function fetchFeeds() {
  console.log("📡 Fetching RSS feeds...");

  const allItems = [];
  const seen = new Set();

  // Parallel fetch
  const feedPromises = FEEDS.map(async ({ url, source }) => {
    try {
      const feed = await parser.parseURL(url);

      return feed.items.map(item => {
        const cleanedTitle = cleanTitle(item.title);

        return {
          id: generateId(item),
          title: cleanedTitle,
          originalTitle: item.title,
          link: item.link,
          pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : null,
          source,
          contentSnippet: item.contentSnippet || '',
        };
      });

    } catch (err) {
      console.error(`❌ RSS failed: ${url}`, err.message);
      return [];
    }
  });

  const results = await Promise.all(feedPromises);

  // Flatten + deduplicate
  for (const feedItems of results) {
    for (const item of feedItems) {
      if (!item.title || item.title.length < 3) continue;

      if (seen.has(item.id)) continue;

      seen.add(item.id);
      allItems.push(item);
    }
  }

  console.log(`📰 Total unique RSS items: ${allItems.length}`);

  return allItems;
}

export default {
  fetchFeeds
};
