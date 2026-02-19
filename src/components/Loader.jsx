import React from "react";
import { motion } from "framer-motion";

export default function LayeredLoader() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative w-12 h-12 bg-[#0A8B41] rounded-xl"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          boxShadow: [
            "0px 0px 0px 0px rgba(0,0,0,0)",
            "20px 20px 0px -4px rgba(0,0,0,0.35)",
          ],
        }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      >
        {/* Top Layer */}
        <motion.span
          className="absolute inset-0 bg-white/70 rounded-2xl"
          animate={{
            x: [0, -25],
            y: [0, -25],
            scale: [1, 1],
          }}
          transition={{
            duration: 1,
            ease: "linear",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      </motion.div>
    </div>
  );
}












// full page

// import React from "react";
// import { motion } from "framer-motion";
// import loaderIcon from "../assets/logo.png";

// export default function PageLoader() {
//   return (
//     <motion.div
//       className="fixed inset-0 z-50 flex items-center justify-center
//                  bg-white/70 backdrop-blur-xl"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       style={{ perspective: 800 }}
//     >
//       <motion.div
//         className="relative w-32 h-32 flex items-center justify-center"
//         animate={{
//           rotateX: [0, 6, 0],
//           rotateY: [0, -6, 0],
//         }}
//         transition={{
//           duration: 4,
//           ease: "easeInOut",
//           repeat: Infinity,
//         }}
//       >
//         {/* Depth Glow */}
//         <motion.div
//           className="absolute inset-0 rounded-full
//                      bg-black/10 blur-2xl"
//           animate={{
//             scale: [0.9, 1.2, 0.9],
//             opacity: [0.25, 0.45, 0.25],
//           }}
//           transition={{
//             duration: 3,
//             ease: "easeInOut",
//             repeat: Infinity,
//           }}
//         />

//         {/* Floating Logo */}
//         <motion.img
//           src={loaderIcon}
//           alt="Loading"
//           className="w-20 h-20 object-contain
//                      drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
//           animate={{
//             y: [-6, 6, -6],
//             scale: [1, 1.04, 1],
//           }}
//           transition={{
//             duration: 2.4,
//             ease: "easeInOut",
//             repeat: Infinity,
//           }}
//         />
//       </motion.div>
//     </motion.div>
//   );
// }
