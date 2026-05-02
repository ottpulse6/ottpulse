import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { trackInteraction } from "../../services/interactionService";

export default function Row({ title, items }) {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3 style={{ marginLeft: "20px" }}>{title}</h3>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          padding: "10px 20px",
          gap: "10px"
        }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.1 }}
            style={{ cursor: "pointer" }}
            onClick={() => {
              trackInteraction(item, "click"); // 🔥 TRACK
              navigate(`/title/${item.id}`);
            }}
          >
            <img
              src={item.poster}
              alt={item.title}
              style={{
                width: "140px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "6px"
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
