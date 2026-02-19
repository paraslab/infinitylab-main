import React, { useEffect, useRef, useState } from "react";

export default function ContactInfoBar() {
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
          setShow(false); // remove if you want only once
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        absolute left-1/2 -bottom-6 w-[92%] max-w-6xl -translate-x-1/2 z-20
        transform transition-all duration-[1600ms] ease-out
        ${
          show
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-[0.96]"
        }
      `}
    >
      <div className="relative bg-[#FFFAFA] rounded-3xl px-6 py-5 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-gray-800">
        {/* Call */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Call us anytime</h3>
          <p className="text-sm">+91 88661 89016</p>
          <p className="text-sm mt-1"></p>
        </div>

        {/* Dividers */}
        <div className="hidden md:block absolute left-1/3 top-8 bottom-8 w-px bg-gray-400/40" />
        <div className="hidden md:block absolute left-2/3 top-8 bottom-8 w-px bg-gray-400/40" />

        {/* Write */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Write to us</h3>
          <p className="text-sm">Info@infinityenergy.xyz</p>
          {/* <p className="text-sm mt-1">hello@mivora.com</p> */}
        </div>

        {/* Open Hours */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Open hours</h3>
          <p className="text-sm mt-1">Sun: Out for a breather</p>
        </div>
      </div>
    </div>
  );
}
