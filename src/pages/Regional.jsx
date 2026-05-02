import { useEffect, useState } from "react";
import { fetchReleases } from "../services/releaseService";

import {
  groupByPlatform,
  getPlatformDisplayName
} from "../services/regionalUtils";

import { getPulseScore } from "../services/pulseService";

import Row from "../components/sections/Row.jsx";
import PageWrapper from "../components/layout/PageWrapper";
import SectionHeader from "../components/ui/SectionHeader";

// Charts
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";

export default function Regional() {
  const [groups, setGroups] = useState({});
  const [selectedLang, setSelectedLang] = useState("all");

  useEffect(() => {
    const load = async () => {
      const data = await fetchReleases();
      setGroups(groupByPlatform(data));
    };
    load();
  }, []);

  const allItems = Object.values(groups).flat();

  const filteredItems =
    selectedLang === "all"
      ? allItems
      : allItems.filter((i) => i.language === selectedLang);

  const languages = [
    "all",
    ...new Set(allItems.map((i) => i.language).filter(Boolean))
  ];

  // 📊 Platform dominance
  const dominance = Object.keys(groups)
    .map((p) => ({
      name: getPlatformDisplayName(p),
      value: groups[p].length
    }))
    .sort((a, b) => b.value - a.value);

  // 🎬 Smart genre (pulse-weighted)
  const genreMap = {};
  filteredItems.forEach((item) => {
    const g = item.genre || "Other";
    const weight = getPulseScore(item.id) || 1;
    genreMap[g] = (genreMap[g] || 0) + weight;
  });

  const maxVal = Math.max(...Object.values(genreMap), 1);

  const genreData = Object.keys(genreMap)
    .map((g) => ({
      name: g,
      value: Math.round((genreMap[g] / maxVal) * 100)
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <PageWrapper>
      <SectionHeader
        title="🌍 Regional OTT Intelligence"
        subtitle="Platform dominance & genre insights"
      />

      {/* 📊 Charts */}
      <div style={{ display: "grid", gap: "20px", marginBottom: "30px" }}>
        
        <div style={card}>
          <h3>📊 Platform Dominance</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={dominance} dataKey="value" nameKey="name" outerRadius={90} label>
                  {dominance.map((_, i) => <Cell key={i} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={card}>
          <h3>🎬 Genre Trends (Smart)</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={genreData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🎯 Language filter */}
      <div style={{ marginBottom: "20px" }}>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLang(lang)}
            style={{
              marginRight: "10px",
              padding: "6px 10px",
              background: selectedLang === lang ? "white" : "#222",
              color: selectedLang === lang ? "black" : "white",
              border: "1px solid #444"
            }}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* 📺 Rows */}
      {Object.keys(groups).map((platform) => {
        let items = groups[platform];

        if (selectedLang !== "all") {
          items = items.filter((i) => i.language === selectedLang);
        }

        const trending = [...items]
          .sort((a, b) => getPulseScore(b.id) - getPulseScore(a.id))
          .slice(0, 10);

        if (!trending.length) return null;

        return (
          <Row
            key={platform}
            title={`📺 ${getPlatformDisplayName(platform)}`}
            items={trending}
          />
        );
      })}
    </PageWrapper>
  );
}

const card = {
  background: "#111",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #222"
};