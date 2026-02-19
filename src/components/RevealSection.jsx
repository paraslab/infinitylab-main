import React, { useEffect, useRef, useState } from "react";

export default function RevealSection({
  image,
  title,
  subtitle,
  rounded = "rounded-3xl",
  height = "h-[600px]",
}) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
        } else {
          setShow(false); 
        }
      },
      {
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="pt-4 rounded-[40px]">
      <div
        className={`
          relative ${rounded} overflow-hidden
          transform transition-all duration-[1800ms] ease-out
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        `}
      >
        {/* Background */}
        <div
          className={`
            absolute inset-0 bg-cover bg-center brightness-75
            transition-all duration-[2200ms] ease-out
            ${show ? "blur-0 scale-100" : "blur-lg scale-110"}
          `}
          style={{ backgroundImage: `url(${image})` }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/100" />

        {/* Content */}
        <div
          className={`relative z-20 flex flex-col items-center justify-center text-center px-6 ${height}`}
        >
          <h1
            className={`
              text-white text-5xl font-light max-w-4xl
              transition-all duration-[1600ms] delay-300
              ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
            `}
          >
            {title}
          </h1>

          <p
            className={`
              text-white/90 mt-6 max-w-2xl text-lg
              transition-all duration-[1600ms] delay-600
              ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
            `}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}