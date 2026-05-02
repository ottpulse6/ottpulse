import admin from "firebase-admin";

// 🔐 Parse Firebase Admin key
const serviceAccount = JSON.parse(
  process.env.FIREBASE_ADMIN_KEY || "{}"
);

// 🔥 Init Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

export const runIngestion = async () => {
  console.log("🔥 Running server ingestion...");

  // ✅ SIMPLE TEST WRITE (no rssService, no frontend deps)
  await db.collection("content").add({
    title: "Backend Ingest Test",
    platform: "netflix",
    confidence: 0.95,
    createdAt: Date.now()
  });

  console.log("✅ Firestore write success");
};
