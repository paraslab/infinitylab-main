import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function QuoteCard({
  imageLeft,
  imageRight,
  quote,
  description,
  page,
}) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  /* Scroll trigger */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full px-4 py-16 md:pt-24 md:pb-0 overflow-hidden"
    >
      {/* ================= MOBILE IMAGES ================= */}
      <div
        className={`
          flex md:hidden justify-center gap-5 mb-8
          transition-all duration-700
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
      >
        <MobileImage src={imageLeft} rotate="-6deg" />
        <MobileImage src={imageRight} rotate="6deg" />
      </div>

      {/* ================= TABLET LAYOUT ================= */}
      <div
        className={`
          hidden md:flex lg:hidden
          max-w-5xl mx-auto
          items-center justify-between gap-10 mb-12
          transition-all duration-700
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
      >
        <DesktopImage src={imageLeft} rotate="-6deg" />
        <DesktopImage src={imageRight} rotate="6deg" />
      </div>

      {/* ================= DESKTOP FLOAT LEFT ================= */}
      <div
        className={`
          hidden lg:block absolute top-24 left-[8%]
          transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        `}
      >
        <DesktopImage src={imageLeft} rotate="-8deg" slow />
      </div>

      {/* ================= DESKTOP FLOAT RIGHT ================= */}
      <div
        className={`
          hidden lg:block absolute top-28 right-[8%]
          transition-all duration-1000 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        `}
      >
        <DesktopImage src={imageRight} rotate="6deg" />
      </div>

      {/* ================= CONTENT ================= */}
      <div
        className={`
          max-w-4xl mx-auto text-center
          transition-all duration-700 delay-100
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#1f1f1f] leading-snug">
          “{quote}”
        </h1>

        {description && (
          <p className="mt-6 text-base sm:text-lg text-[#4b4b4b] leading-relaxed">
            {description}
          </p>
        )}

        {page && (
          <div className="mt-8">
            <Link
              to={page}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1f1f1f] border-b border-[#1f1f1f] pb-1 hover:opacity-70 transition"
            >
              Learn more <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>

      {/* ================= FLOAT ANIMATIONS ================= */}
      <style>{`
        @keyframes floatSoft {
          0% { transform: translateY(0) rotate(var(--r)); }
          50% { transform: translateY(-8px) rotate(var(--r)); }
          100% { transform: translateY(0) rotate(var(--r)); }
        }

        @keyframes floatSlow {
          0% { transform: translateY(0) rotate(var(--r)); }
          50% { transform: translateY(-18px) rotate(calc(var(--r) + 4deg)); }
          100% { transform: translateY(0) rotate(var(--r)); }
        }

        .float-soft {
          animation: floatSoft 5s ease-in-out infinite;
        }

        .float-slow {
          animation: floatSlow 7s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

/* ================= SUB COMPONENTS ================= */

function MobileImage({ src, rotate }) {
  return (
    <div
      className="bg-white p-1.5 rounded-xl shadow-md"
      style={{ transform: `rotate(${rotate})` }}
    >
      <img
        src={src}
        alt=""
        className="w-20 h-24 object-cover rounded-lg"
      />
    </div>
  );
}

function DesktopImage({ src, rotate, slow }) {
  return (
    <div
      className={`bg-white p-2 rounded-2xl shadow-lg ${
        slow ? "float-slow" : "float-soft"
      }`}
      style={{ "--r": rotate }}
    >
      <img
        src={src}
        alt=""
        className="w-28 h-36 object-cover rounded-xl"
      />
    </div>
  );
}
