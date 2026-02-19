import { motion } from "framer-motion";
import loaderIcon from "../assets/logo.png";

export default function PageLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center
                 bg-white/70 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ perspective: 800 }}
    >
      <motion.div
        className="relative w-32 h-32 flex items-center justify-center"
        animate={{
          rotateX: [0, 6, 0],
          rotateY: [0, -6, 0],
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        {/* Glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-black/10 blur-2xl"
          animate={{
            scale: [0.9, 1.2, 0.9],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        {/* Logo */}
        <motion.img
          src={loaderIcon}
          alt="Loading"
          className="w-20 h-20 object-contain
                     drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
          animate={{
            y: [-6, 6, -6],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 2.4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
