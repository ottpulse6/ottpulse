import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeTitle, similarity } from "../utils";

const THRESHOLD = 0.75;

export const findDuplicate = async (incomingTitle) => {
  const slug = normalizeTitle(incomingTitle);

  // 🔥 STEP 1: exact slug match (FAST)
  const q = query(
    collection(db, "content"),
    where("slug", "==", slug)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // 🔥 STEP 2: fallback fuzzy match (SLOW)
  const all = await getDocs(collection(db, "content"));

  let bestMatch = null;
  let bestScore = 0;

  all.forEach((doc) => {
    const data = doc.data();

    const score = similarity(
      slug,
      normalizeTitle(data.title)
    );

    if (score > bestScore && score > THRESHOLD) {
      bestScore = score;
      bestMatch = { id: doc.id, ...data };
    }
  });

  return bestMatch;
};