import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export const fetchReleases = async () => {
  const snap = await getDocs(collection(db, "releases"));

  console.log("SNAPSHOT SIZE:", snap.size);

  return snap.docs.map(doc => {
    const d = doc.data();
    return {
      id: doc.id,
      title: d.title || "Untitled",
      poster: d.poster || "",
      releaseDate: d.releaseDate || null,
      voteAverage: d.voteAverage || 0,
      platforms: d.platforms || [],
      description: d.description || ""
    };
  });
};
