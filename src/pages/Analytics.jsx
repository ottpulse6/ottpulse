import { useEffect, useState } from "react";
import { fetchReleases } from "../services/releaseService";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

import { getPulseScore } from "../services/pulseService";

export default function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetchReleases();
      setData(res);
    };
    load();
  }, []);

  // 🔥 Pulse-weighted platform dominance
  const platformScore = {};

  data.forEach(item => {
    const score = getPulseScore(item.id) || 1; // fallback

    item.platforms?.forEach(p => {
      platformScore[p] = (platformScore[p] || 0) + score;
    });
  });

  const chartData = Object.keys(platformScore).map(key => ({
    name: key,
    value: platformScore[key]
  }));

  return (
    <div style={{ background: "black", color: "white", padding: "20px", minHeight: "100vh" }}>
      <h1>📊 OTT Pulse Analytics</h1>

      <h2>🔥 Platform Dominance (Pulse-Based)</h2>

      <PieChart width={400} height={400}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          outerRadius={150}
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}