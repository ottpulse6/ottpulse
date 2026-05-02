import { runIngestion } from "../src/server/ingestServer.js";

export default async function handler(req, res) {
  try {
    console.log("🚀 Backend ingestion started");

    await runIngestion();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ ERROR:", error);
    return res.status(500).json({
      error: error.message || "Ingestion failed"
    });
  }
}
