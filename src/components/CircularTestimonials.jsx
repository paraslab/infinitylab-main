import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function calculateGap(width) {
  if (width < 640) return 40;
  if (width < 1024) return 70;
  return 110;
}

export default function CircularTestimonials({
  testimonials = [],
  autoplay = true,
  colors = {},
  fontSizes = {},
}) {
  const colorName = colors.name ?? "#000";
  const colorDesignation = colors.designation ?? "#666";
  const colorTestimony = colors.testimony ?? "#333";
  const colorArrowBg = colors.arrowBackground ?? "#111";
  const colorArrowFg = colors.arrowForeground ?? "#fff";
  const colorArrowHoverBg = colors.arrowHoverBackground ?? "#00a6fb";

  const fontSizeName = fontSizes.name ?? "1.5rem";
  const fontSizeDesignation = fontSizes.designation ?? "1rem";
  const fontSizeQuote = fontSizes.quote ?? "1.1rem";

  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const imageContainerRef = useRef(null);
  const autoplayRef = useRef(null);

  const len = testimonials.length;
  const active = testimonials[activeIndex] || {};

  // measure width
  useEffect(() => {
    const update = () => {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // autoplay
  useEffect(() => {
    if (!autoplay || len === 0) return;
    autoplayRef.current = setInterval(() => {
      setActiveIndex((p) => (p + 1) % len);
    }, 5000);
    return () => clearInterval(autoplayRef.current);
  }, [autoplay, len]);

  const handleNext = useCallback(() => {
    setActiveIndex((p) => (p + 1) % len);
  }, [len]);

  const handlePrev = useCallback(() => {
    setActiveIndex((p) => (p - 1 + len) % len);
  }, [len]);

  function getImageStyle(index) {
    const gap = calculateGap(containerWidth);
    const lift = 30;

    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + len) % len === index;
    const isRight = (activeIndex + 1) % len === index;

    if (isActive) {
      return {
        transform: "translateX(0) scale(1)",
        zIndex: 30,
        opacity: 1,
      };
    }
    if (isLeft) {
      return {
        transform: `translateX(-${gap}px) scale(0.9) translateY(-${lift}px)`,
        zIndex: 20,
        opacity: 0.9,
      };
    }
    if (isRight) {
      return {
        transform: `translateX(${gap}px) scale(0.9) translateY(-${lift}px)`,
        zIndex: 20,
        opacity: 0.9,
      };
    }
    return {
      transform: "scale(0.8)",
      zIndex: 10,
      opacity: 0,
    };
  }

  const quoteVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6">
      <div className="grid gap-16 md:grid-cols-2 items-center">
        {/* IMAGES */}
        <div
          ref={imageContainerRef}
          className="relative h-[420px] w-full flex items-center justify-center"
        >
          {testimonials.map((t, i) => (
            <img
              key={i}
              src={t.src}
              alt={t.name}
              className="absolute h-full w-[280px] sm:w-[320px] md:w-[360px] rounded-2xl object-cover shadow-2xl transition-all duration-700 ease-out"
              style={getImageStyle(i)}
            />
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <h3
                className="font-bold mb-1"
                style={{ color: colorName, fontSize: fontSizeName }}
              >
                {active.name}
              </h3>
              <p
                className="mb-6"
                style={{
                  color: colorDesignation,
                  fontSize: fontSizeDesignation,
                }}
              >
                {active.designation}
              </p>
              <p
                className="leading-relaxed"
                style={{ color: colorTestimony, fontSize: fontSizeQuote }}
              >
                {active.quote}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* ARROWS */}
          <div className="mt-10 flex gap-6">
            <button
              onClick={handlePrev}
              className="flex h-11 w-11 items-center justify-center rounded-2xl transition"
              style={{ backgroundColor: colorArrowBg }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  colorArrowHoverBg)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = colorArrowBg)
              }
            >
              <FaArrowLeft color={colorArrowFg} />
            </button>

            <button
              onClick={handleNext}
              className="flex h-11 w-11 items-center justify-center rounded-2xl transition"
              style={{ backgroundColor: colorArrowBg }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  colorArrowHoverBg)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = colorArrowBg)
              }
            >
              <FaArrowRight color={colorArrowFg} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
