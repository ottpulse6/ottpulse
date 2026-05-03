import { runIngestion } from '../src/services/ingestService.js';

export default async function handler(req, res) {
  try {
    const data = await runIngestion();

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
