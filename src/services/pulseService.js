const KEY = "ottpulse_metrics";

const getMetrics = () => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : {};
};

const saveMetrics = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

// Track view (when detail page opens)
export const trackView = (id) => {
  const metrics = getMetrics();

  if (!metrics[id]) {
    metrics[id] = { views: 0, watchlist: 0 };
  }

  metrics[id].views += 1;
  saveMetrics(metrics);
};

// Track watchlist
export const trackWatchlist = (id, added) => {
  const metrics = getMetrics();

  if (!metrics[id]) {
    metrics[id] = { views: 0, watchlist: 0 };
  }

  metrics[id].watchlist += added ? 1 : -1;
  saveMetrics(metrics);
};

// Get score
export const getPulseScore = (id) => {
  const metrics = getMetrics();

  if (!metrics[id]) return 0;

  return (
    metrics[id].views * 1 +
    metrics[id].watchlist * 5
  );
};