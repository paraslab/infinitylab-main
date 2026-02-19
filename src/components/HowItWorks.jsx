import React, { useRef } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

/* 🔹 Steps data */
const steps = [
  {
    number: "1",
    title: "ISLAND",
    description:
      "Standalone BESS for remote areas, delivering reliable power when grid access is limited or unavailable.",
    rotation: -12,
    zIndex: 1,
    page: "/solutions/island-mode",
  },
  {
    number: "2",
    title: "Hybrid Mode",
    description:
      "Combines grid, solar, and generators to improve efficiency, flexibility, and system reliability.",
    rotation: 12,
    zIndex: 2,
    page: "/solutions/hybrid-mode",
  },
  {
    number: "3",
    title: "Microgrid Mode",
    description:
      "Self-sufficient local energy systems that operate independently with full control and stability.",
    rotation: -10,
    zIndex: 1,
    page: "/solutions/microgrid-mode",
  },
];

export default function HowItWorks() {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  /* 🔄 Scroll progress */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  /* 🌊 Raw parallax transforms */
  const rawTransforms = prefersReducedMotion
    ? [0, 0, 0]
    : [
        useTransform(scrollYProgress, [0, 1], [90, -90]),
        useTransform(scrollYProgress, [0, 1], [0, 0]),
        useTransform(scrollYProgress, [0, 1], [-90, 90]),
      ];

  /* ✨ Spring smoothing */
  const springConfig = {
    stiffness: 60,
    damping: 20,
    mass: 0.6,
  };

  const yTransforms = rawTransforms.map((t) =>
    typeof t === "number" ? t : useSpring(t, springConfig)
  );

  return (
    <section className="py-24 min-h-screen flex items-center justify-center overflow-hidden">
      <LazyMotion features={domAnimation}>
        <div
          ref={containerRef}
          className="relative max-w-5xl mx-auto px-6 md:px-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, i) => (
              <StepCard
                key={i}
                step={step}
                y={yTransforms[i]}
                delay={i * 0.12}
              />
            ))}
          </div>
        </div>
      </LazyMotion>
    </section>
  );
}

/* ---------------- Card ---------------- */

function StepCard({ step, y, delay }) {
  const ref = useRef(null);
  const navigate = useNavigate();
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <m.div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={() => navigate(step.page)}
      onKeyDown={(e) => e.key === "Enter" && navigate(step.page)}
      initial={{ opacity: 0, y: 60, scale: 0.94 }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
            }
          : {}
      }
      transition={{
        delay,
        type: "spring",
        stiffness: 80,
        damping: 18,
        mass: 0.8,
      }}
      whileHover={{
        scale: 1.04,
        y: -6,
      }}
      style={{
        y,
        rotate: step.rotation,
        zIndex: step.zIndex,
        willChange: "transform",
      }}
      className="
        cursor-pointer
        bg-[#FFFAFA]
        rounded-2xl
        p-6 md:p-8
        shadow-lg
        border border-zinc-200
        flex flex-col
        h-[300px] md:h-[380px]
        relative
        focus:outline-none
      "
    >
      {/* Number */}
      <div className="text-6xl font-medium text-[#2F8F6A] mb-auto select-none">
        {step.number}
      </div>

      {/* Content */}
      <m.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: delay + 0.15, duration: 0.4 }}
        className="mt-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {step.title}
        </h3>
        <p className="text-gray-500 leading-relaxed">
          {step.description}
        </p>
      </m.div>

      {/* CTA */}
      <div className="mt-4 text-sm font-medium text-gray-900">
        Learn more →
      </div>

      {/* Soft bottom glow */}
      <div className="absolute -bottom-4 left-6 right-6 h-6 rounded-2xl opacity-30 blur-md bg-black/10" />
    </m.div>
  );
}
