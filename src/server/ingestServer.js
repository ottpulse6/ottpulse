import admin from "firebase-admin";

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
  console.log("🔥 Running backend ingestion...");

  await db.collection("content").add({
    title: "Backend working",
    createdAt: Date.now()
  });

  console.log("✅ Firestore write success");
};
