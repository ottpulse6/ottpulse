import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchReleases } from "../services/releaseService";
import { trackInteraction } from "../services/interactionService";

export default function Detail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetchReleases().then((data) => {
      const found = data.find((i) => i.id === id);
      setItem(found);

      if (found) {
        trackInteraction(found, "view"); // 🔥 STRONG SIGNAL
      }
    });
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>{item.title}</h1>
      <img src={item.poster} style={{ width: "300px" }} />
      <p>{item.description}</p>
    </div>
  );
}
