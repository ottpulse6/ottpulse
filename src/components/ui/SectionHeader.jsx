import { motion } from "framer-motion";

export default function SectionHeader({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ marginBottom: "20px" }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: "800" }}>
        {title}
      </h1>

      {subtitle && (
        <p style={{ color: "#aaa", marginTop: "5px" }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}