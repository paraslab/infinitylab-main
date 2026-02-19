// HeroSingleImage.jsx
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

export default function HeroSingleImage({
  image,
  title,
  subtitle,
  ctas = [],
  heightClass = "h-72 md:h-96",
  rounded = "rounded-2xl",
  overlayPosition = "left",
  children,
  className = "",
}) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  const posMap = {
    left: "items-start text-left pl-6 md:pl-12",
    center: "items-center text-center px-6 md:px-12",
    right: "items-end text-right pr-6 md:pr-12",
  };

  // 👇 Animate on enter / exit viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShow(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`
        w-full ${className} ${rounded} relative overflow-hidden shadow-lg
        transition-all duration-[1800ms] ease-out transform
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
      aria-label="Hero"
    >
      {/* IMAGE */}
      <div className={`w-full ${heightClass} bg-gray-100`}>
        <img
          src={image}
          alt=""
          draggable="false"
          className={`
            w-full h-full object-cover block
            transition-all duration-[2200ms] ease-out
            ${show ? "blur-0 scale-100" : "blur-lg scale-110"}
          `}
        />
      </div>

      {/* GRADIENT OVERLAY */}
      <div
        aria-hidden
        className={`absolute inset-0 pointer-events-none ${rounded}`}
        style={{
          background:
            "linear-gradient(90deg, rgba(12,12,12,0.55) 0%, rgba(12,12,12,0.30) 30%, rgba(12,12,12,0.0) 60%)",
        }}
      />

      {/* CONTENT */}
      <div
        className={`absolute inset-0 flex ${posMap[overlayPosition]} ${rounded} pointer-events-none`}
      >
        <div
          className={`
            pointer-events-auto max-w-3xl py-6 md:py-12
            transition-all duration-[1600ms] delay-300
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
        >
          {children ? (
            children
          ) : (
            <>
              {title && (
                <h1 className="text-white text-3xl md:text-6xl font-serif leading-tight drop-shadow-md">
                  {title}
                </h1>
              )}

              {subtitle && (
                <p className="mt-4 text-white/90 max-w-xl text-sm md:text-base drop-shadow-sm">
                  {subtitle}
                </p>
              )}

              {ctas?.length > 0 && (
                <div
                  className={`
                    mt-6 flex flex-wrap gap-3
                    transition-all duration-[1600ms] delay-500
                    ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                  `}
                >
                  {ctas.map((c, i) => {
                    const isSolid = c.variant !== "outline";
                    return (
                      <a
                        key={i}
                        href={c.href || "#"}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                          isSolid
                            ? "bg-white text-emerald-700"
                            : "border border-white/40 text-white/95 bg-white/5"
                        }`}
                      >
                        {c.label}
                      </a>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

HeroSingleImage.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  ctas: PropTypes.array,
  heightClass: PropTypes.string,
  rounded: PropTypes.string,
  overlayPosition: PropTypes.oneOf(["left", "center", "right"]),
  children: PropTypes.node,
  className: PropTypes.string,
};
