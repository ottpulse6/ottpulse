import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function PosterCard({ item }) {
  const navigate = useNavigate(); // ✅ must be inside component

  return (
    <motion.div
      whileHover={{ scale: 1.12 }}
      onClick={() => navigate(`/title/${item.id}`)} // ✅ click handler
      style={{
        minWidth: "150px",
        cursor: "pointer"
      }}
    >
      <img
        src={item.poster}
        alt={item.title}
        style={{
          width: "150px",
          height: "220px",
          objectFit: "cover",
          borderRadius: "8px"
        }}
      />
    </motion.div>
  );
}
