import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "linear-gradient(to bottom, #000, #0a0a0a)",
        minHeight: "100vh",
        color: "white",
        padding: "20px 30px"
      }}
    >
      {children}
    </motion.div>
  );
}
