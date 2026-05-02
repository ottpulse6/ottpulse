import { useEffect, useState, useMemo } from "react";
import { fetchReleases } from "../services/releaseService";
import { useNavigate } from "react-router-dom";

import { getTopPulseItems } from "../services/pulseUtils";
import { getFinalScore, getRisingScore } from "../utils";

import { getRecommendations } from "../services/recommendationService";

import Hero from "../components/sections/Hero";
import Row from "../components/sections/Row";
import PulseOfMonth from "../components/sections/PulseOfMonth";

import PageWrapper from "../components/layout/PageWrapper";

import { login, logout } from "../services/authService";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { motion } from "framer-motion";

import logo from "../assets/logo.png";

export default function Home() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [recommended, setRecommended] = useState([]);

  const navigate = useNavigate();

  // 🔹 Load content
  useEffect(() => {
    fetchReleases().then(setData);
  }, []);

  // 🔐 Auth + points + recommendations
  useEffect(() => {
    const auth = getAuth();
    let unsubPoints;

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);

      if (!u) {
        setPoints(0);
        setRecommended([]);
        if (unsubPoints) unsubPoints();
        return;
      }

      // 🔥 Real-time points
      unsubPoints = onSnapshot(doc(db, "users", u.uid), (snap) => {
        if (snap.exists()) {
          setPoints(snap.data().points || 0);
        }
      });

      // 🔥 Load recommendations
      getRecommendations(u.uid).then(setRecommended);
    });

    return () => {
      unsubAuth();
      if (unsubPoints) unsubPoints();
    };
  }, []);

  // 🔥 Trending (Pulse × Confidence × Freshness)
  const trending = useMemo(
    () =>
      [...data]
        .sort((a, b) => getFinalScore(b) - getFinalScore(a))
        .slice(0, 10),
    [data]
  );

  // 🆕 New Releases (recency)
  const newReleases = useMemo(
    () =>
      [...data]
        .sort((a, b) => {
          const da = new Date(a.releaseDate || a.lastUpdated || 0).getTime();
          const db = new Date(b.releaseDate || b.lastUpdated || 0).getTime();
          return db - da;
        })
        .slice(0, 10),
    [data]
  );

  // 📈 Rising (momentum)
  const rising = useMemo(
    () =>
      [...data]
        .sort((a, b) => getRisingScore(b) - getRisingScore(a))
        .slice(0, 10),
    [data]
  );

  // 🔥 Pulse of Month
  const pulseTop = useMemo(() => getTopPulseItems(data, 5), [data]);

  // 🎯 KEEP YOUR EXISTING STYLE (unchanged)
  const navBtn = {
    padding: "6px 12px",
    background: "transparent",
    color: "#e5e5e5",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    letterSpacing: "0.3px"
  };

  return (
    <PageWrapper>

      {/* 🔥 HEADER (UNCHANGED UI) */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 28px",
          background: "rgba(0,0,0,0.9)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #111",
          marginBottom: "25px"
        }}
      >
        {/* LEFT */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          
          <motion.img
            src={logo}
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.1 }}
            style={{
              height: "48px",
              width: "48px",
              objectFit: "contain",
              cursor: "pointer"
            }}
          />

          {["regional", "analytics", "leaderboard"].map((route) => (
            <motion.button
              key={route}
              whileHover={{ scale: 1.1, color: "#fff" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/${route}`)}
              style={navBtn}
            >
              {route.charAt(0).toUpperCase() + route.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          
          <span style={{ fontWeight: "700", color: "#fff" }}>
            ⚡ {points}
          </span>

          {["watchlist", "forum", "profile"].map((route) => (
            <motion.button
              key={route}
              whileHover={{ scale: 1.1, color: "#fff" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/${route}`)}
              style={navBtn}
            >
              {route.charAt(0).toUpperCase() + route.slice(1)}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={user ? logout : login}
            style={{
              padding: "6px 12px",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "4px",
              background: "transparent",
              fontWeight: "600"
            }}
          >
            {user ? "Logout" : "Login"}
          </motion.button>
        </div>
      </motion.div>

      {/* 🎬 HERO */}
      <Hero items={trending} />

      {/* 🎯 RECOMMENDED */}
      {recommended.length > 0 && (
        <Row title="🎯 Recommended For You" items={recommended} />
      )}

      {/* 🔥 Pulse */}
      <PulseOfMonth items={pulseTop} />

      {/* 🎞 ROWS */}
      <Row title="🔥 Trending Now" items={trending} />
      <Row title="🆕 New Releases" items={newReleases} />
      <Row title="📈 Rising Now" items={rising} />

    </PageWrapper>
  );
}
