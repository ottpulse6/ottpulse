export default async function handler(req, res) {
  console.log("🚀 Ingest API hit");

  try {
    const data = await runIngestion();

    console.log("✅ Ingestion success", data.length);

    res.status(200).json({ success: true, count: data.length });

  } catch (err) {
    console.error("❌ INGEST ERROR:", err);
    console.error("STACK:", err.stack);

    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
}
