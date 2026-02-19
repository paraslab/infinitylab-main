import React, { createContext, useContext, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

// simple cn helper
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
  


const SPRING_TRANSITION_CONFIG = {
  type: "spring",
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
};

const variants = {
  hidden: {
    filter: "blur(10px)",
    opacity: 0,
  },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
  },
};

const ContainerScrollContext = createContext(undefined);

function useContainerScrollContext() {
  const context = useContext(ContainerScrollContext);
  if (!context) {
    throw new Error(
      "useContainerScrollContext must be used within a ContainerScroll"
    );
  }
  return context;
}

// ================= ContainerScroll =================
export function ContainerScroll({ children, className, ...props }) {
  const scrollRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start center", "end end"],
  });

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-svh w-full", className)}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
}

// ================= ContainerAnimated =================
export const ContainerAnimated = React.forwardRef(
  (
    {
      className,
      transition,
      style,
      inputRange = [0.2, 0.8],
      outputRange = [80, 0],
      ...props
    },
    ref
  ) => {
    const { scrollYProgress } = useContainerScrollContext();
    const y = useTransform(scrollYProgress, inputRange, outputRange);

    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ y, ...style }}
        transition={{ ...SPRING_TRANSITION_CONFIG, ...transition }}
        {...props}
      />
    );
  }
);

// ================= ContainerSticky =================
export const ContainerSticky = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("sticky left-0 top-0 min-h-svh w-full", className)}
      {...props}
    />
  )
);

// ================= HeroVideo =================
export const HeroVideo = React.forwardRef(
  ({ style, className, ...props }, ref) => {
    const { scrollYProgress } = useContainerScrollContext();
    const scale = useTransform(scrollYProgress, [0, 0.8], [0.7, 1]);

    return (
      <motion.video
        ref={ref}
        className={cn(
          "relative z-10 h-full w-full object-cover",
          className
        )}
        autoPlay
        muted
        loop
        playsInline
        style={{ scale, ...style }}
        {...props}
      />
    );
  }
);

// ================= HeroButton =================
export const HeroButton = React.forwardRef(
  ({ className, ...props }, ref) => (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      ref={ref}
      className={cn(
        "group relative flex w-fit items-center rounded-full border border-lime-400 bg-gray-950/20 px-4 py-2 text-white shadow-[0px_4px_24px_rgba(132,204,22,0.6)] transition-colors hover:bg-gray-950/50",
        className
      )}
      {...props}
    />
  )
);

// ================= ContainerInset =================
export const ContainerInset = React.forwardRef(
  (
    {
      className,
      style,
      insetYRange = [45, 0],
      insetXRange = [45, 0],
      roundednessRange = [1000, 16],
      ...props
    },
    ref
  ) => {
    const { scrollYProgress } = useContainerScrollContext();

    const insetY = useTransform(scrollYProgress, [0, 0.8], insetYRange);
    const insetX = useTransform(scrollYProgress, [0, 0.8], insetXRange);
    const roundedness = useTransform(scrollYProgress, [0, 1], roundednessRange);

    const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${roundedness}px)`;

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative pointer-events-none overflow-hidden",
          className
        )}
        style={{ clipPath, ...style }}
        {...props}
      />
    );
  }
);