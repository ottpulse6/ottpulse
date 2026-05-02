import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const TTL = 1000 * 60 * 60 * 24; // 24 hours

export const getCache = async (key) => {
  const ref = doc(db, "apiCache", key);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();

  // 🔥 expire cache
  if (Date.now() - data.timestamp > TTL) {
    return null;
  }

  return data.value;
};

export const setCache = async (key, value) => {
  await setDoc(doc(db, "apiCache", key), {
    value,
    timestamp: Date.now()
  });
};