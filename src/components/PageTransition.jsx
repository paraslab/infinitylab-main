import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PageTransition({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    // ENTER animation
    gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        scale: 0.96,
        y: 30,
        filter: "blur(12px)",
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power3.out",
        clearProps: "filter",
      }
    );

    // EXIT animation
    return () => {
      gsap.to(ref.current, {
        opacity: 0,
        scale: 0.98,
        y: -20,
        filter: "blur(8px)",
        duration: 0.45,
        ease: "power2.in",
      });
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </div>
  );
}
