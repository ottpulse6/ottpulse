import { useEffect, useState } from "react";
import { getWatchlist } from "../services/watchlistService";

export default function Watchlist() {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(getWatchlist());
  }, []);

  return (
    <div style={{ color: "white", padding: "20px" }}>
      <h1>My Watchlist</h1>

      {list.length === 0 && <p>No items yet</p>}

      <div style={{ display: "flex", gap: "10px" }}>
        {list.map(item => (
          <img
            key={item.id}
            src={item.poster}
            style={{ width: "120px", borderRadius: "6px" }}
          />
        ))}
      </div>
    </div>
  );
}