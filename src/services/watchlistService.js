const KEY = "ottpulse_watchlist";

export const getWatchlist = () => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const addToWatchlist = (item) => {
  const list = getWatchlist();

  const exists = list.find(i => i.id === item.id);
  if (exists) return;

  list.push(item);
  localStorage.setItem(KEY, JSON.stringify(list));
};

export const removeFromWatchlist = (id) => {
  const list = getWatchlist().filter(i => i.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
};

export const isInWatchlist = (id) => {
  return getWatchlist().some(i => i.id === id);
};