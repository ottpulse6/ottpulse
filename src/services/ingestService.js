import admin from "firebase-admin";

// 🔐 Firebase Admin init
const serviceAccount = JSON.parse(
  process.env.FIREBASE_ADMIN_KEY || "{}"
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

export const runIngestion = async () => {
  console.log("🚀 Running ingestion...");

  // 🔥 TEMP: no RSS, just test write
  await db.collection("content").add({
    title: "Test Ingest Item",
    platform: "netflix",
    confidence: 0.9,
    createdAt: Date.now()
  });

  console.log("✅ Ingestion success");
};
