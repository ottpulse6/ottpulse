import { useEffect, useState } from "react";

export default function Hero({ items }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items.length) return;

    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items]);

  if (!items.length) return null;

  const item = items[index];

  return (
    <div style={{
      position: "relative",
      height: "75vh",
      overflow: "hidden"
    }}>
      {/* Background */}
      <img
        src={item.poster}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.6)"
        }}
      />

      {/* Gradient */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, black, transparent)"
      }} />

      {/* Content */}
      <div style={{
        position: "absolute",
        bottom: "50px",
        left: "30px",
        maxWidth: "500px"
      }}>
        <h1 style={{ fontSize: "2.5rem" }}>{item.title}</h1>
        <p style={{ opacity: 0.8 }}>
          {item.description?.slice(0, 120)}...
        </p>

        <button style={{
          marginTop: "10px",
          padding: "10px 20px",
          background: "white",
          color: "black",
          border: "none",
          cursor: "pointer"
        }}>
          ▶ Play
        </button>
      </div>
    </div>
  );
}
