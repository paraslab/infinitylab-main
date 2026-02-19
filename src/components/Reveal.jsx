import React, { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  offset = 40,   // start from bottom (px)
  duration = 900,
  className = "",
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
          setShow(false); // replay when scrolling back
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all ease-out transform ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        opacity: show ? 1 : 0,
        transform: show
          ? "translateY(0px)"
          : `translateY(${offset}px)`,
      }}
    >
      {children}
    </div>
  );
}
