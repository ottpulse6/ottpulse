import { runIngestion } from "../src/server/ingestServer.js";

export default async function handler(req, res) {
  try {
    await runIngestion();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Ingestion failed" });
  }
}
