import { runIngestion } from "../src/services/ingestService.js";

export default async function handler(req, res) {
  try {
    console.log("🚀 Ingestion started");

    await runIngestion();

    console.log("✅ Ingestion completed");

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Ingestion error:", error);
    return res.status(500).json({ error: "Ingestion failed" });
  }
}
