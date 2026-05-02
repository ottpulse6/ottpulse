import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";

// 🔥 Track any interaction
export const trackInteraction = async (item, type = "click") => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const interaction = {
      contentId: item.id,
      title: item.title || "",
      genre: item.genre || "unknown",
      platform: item.platform || "unknown",
      language: item.language || "unknown",
      type,
      timestamp: Date.now()
    };

    await updateDoc(doc(db, "users", user.uid), {
      interactions: arrayUnion(interaction)
    });
  } catch (error) {
    console.error("Interaction tracking error:", error);
  }
};