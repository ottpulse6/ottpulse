import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export const login = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // 🔥 Save user in Firestore
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        points: 0,
        createdAt: Date.now()
      },
      { merge: true } // ✅ prevents overwrite
    );

    return user;
  } catch (error) {
    console.error("Login error:", error);
  }
};

export const logout = async () => {
  await signOut(auth);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};