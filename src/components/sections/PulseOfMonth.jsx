export default function PulseOfMonth({ items }) {
  if (!items.length) return null;

  const top = items[0];

  return (
    <div style={{
      padding: "20px",
      marginBottom: "20px",
      borderBottom: "1px solid #333"
    }}>
      <h2>🔥 Pulse of the Month</h2>

      <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
        
        {/* Top Item */}
        <div>
          <img
            src={top.poster}
            style={{ width: "200px", borderRadius: "10px" }}
          />
          <h3>{top.title}</h3>
        </div>

        {/* Others */}
        <div style={{ display: "flex", gap: "10px" }}>
          {items.slice(1).map(item => (
            <img
              key={item.id}
              src={item.poster}
              style={{ width: "120px", borderRadius: "6px" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}