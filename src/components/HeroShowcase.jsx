import React, { useEffect, useRef } from "react";

export default function HeroShowcaseParallax({
  title = "At Eco-Supply transportation, we are redefining logistics by integrating sustainability into every mile.",
  images = ["/images/left.jpg", "/images/center.jpg", "/images/right.jpg"],
  strength = 0.35,
  centerStrength = 0.18,
  maxOffset = 120,
  threshold = 0.35,
}) {
  const rootRef = useRef(null);
  const leftRef = useRef(null);
  const centerRef = useRef(null);
  const rightRef = useRef(null);
  const titleRef = useRef(null);

  const raf = useRef(null);
  const enabled = useRef(false);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        enabled.current = entry.intersectionRatio >= threshold;
        if (!enabled.current) reset();
      },
      { threshold: [0, threshold, 1] }
    );

    observer.observe(root);

    const animate = () => {
      if (!enabled.current) return;

      const rect = root.getBoundingClientRect();
      const viewport = window.innerHeight;

      // scroll progress INSIDE section (0 → 1)
      const progress = clamp(
        1 - (rect.top + rect.height * 0.35) / viewport,
        0,
        1
      );

      const isMobile = window.innerWidth < 768;

      const sideOffset =
        progress * maxOffset * (isMobile ? strength * 1.3 : strength);

      const centerOffset =
        progress * maxOffset * (isMobile ? centerStrength * 1.4 : centerStrength);

      if (leftRef.current)
        leftRef.current.style.transform = `translate3d(0, ${-sideOffset}px, 0)`;

      if (rightRef.current)
        rightRef.current.style.transform = `translate3d(0, ${-sideOffset}px, 0)`;

      if (centerRef.current)
        centerRef.current.style.transform = `translate3d(0, ${-centerOffset}px, 0)`;

      if (titleRef.current) {
        titleRef.current.style.transform = `translate3d(0, ${
          -progress * 60
        }px, 0)`;
        titleRef.current.style.opacity = clamp(1 - progress * 0.55, 0.45, 1);
      }

      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, [strength, centerStrength, maxOffset, threshold, prefersReducedMotion]);

  const reset = () => {
    [leftRef, centerRef, rightRef, titleRef].forEach((r) => {
      if (r.current) {
        r.current.style.transform = "";
        r.current.style.opacity = "";
      }
    });
  };

  return (
    <section ref={rootRef} className="relative py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10">

        {/* TITLE */}
        <div
          ref={titleRef}
          className="mb-20 text-center will-change-transform"
        >
          <h2 className="mx-auto max-w-4xl font-extrabold leading-tight text-gray-900 text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h2>
        </div>

        {/* IMAGES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10 items-end">

          {/* LEFT */}
          <div ref={leftRef} className="flex justify-center md:justify-end will-change-transform">
            <ImageCard src={images[0]} />
          </div>

          {/* CENTER */}
          <div
            ref={centerRef}
            className="flex justify-center will-change-transform md:z-10"
          >
            <ImageCard
              src={images[1]}
              large
            />
          </div>

          {/* RIGHT */}
          <div ref={rightRef} className="flex justify-center md:justify-start will-change-transform">
            <ImageCard src={images[2]} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ---------- Image Card ---------- */
function ImageCard({ src, large }) {
  return (
    <div
      className={`overflow-hidden shadow-xl ${
        large
          ? "w-[92%] md:w-[440px] lg:w-[540px] h-[500px] md:h-[620px] rounded-3xl shadow-2xl"
          : "w-[88%] md:w-[320px] lg:w-[360px] h-[420px] md:h-[520px] rounded-2xl"
      }`}
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover scale-[1.02]"
        loading="lazy"
      />
    </div>
  );
}

/* ---------- Utils ---------- */
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
