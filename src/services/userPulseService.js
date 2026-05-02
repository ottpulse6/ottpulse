import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";

// 🔹 Internal helper
const getUserRef = () => {
  const user = getAuth().currentUser;
  if (!user) return null;
  return doc(db, "users", user.uid);
};

/**
 * ⚡ Add Pulse Points
 */
export const addPoints = async (value) => {
  try {
    const ref = getUserRef();
    if (!ref) return;

    await updateDoc(ref, {
      points: increment(value)
    });
  } catch (err) {
    console.error("addPoints error:", err);
  }
};

/**
 * 📊 Track Activity
 */
export const trackView = async () => {
  const ref = getUserRef();
  if (!ref) return;

  await updateDoc(ref, { views: increment(1) });
};

export const trackWatchlist = async () => {
  const ref = getUserRef();
  if (!ref) return;

  await updateDoc(ref, { watchlistAdds: increment(1) });
};

export const trackPost = async () => {
  const ref = getUserRef();
  if (!ref) return;

  await updateDoc(ref, { posts: increment(1) });
};

/**
 * 📥 One-time fetch (optional)
 */
export const getUserPoints = async () => {
  try {
    const ref = getUserRef();
    if (!ref) return 0;

    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().points || 0 : 0;
  } catch (err) {
    console.error("getUserPoints error:", err);
    return 0;
  }
};