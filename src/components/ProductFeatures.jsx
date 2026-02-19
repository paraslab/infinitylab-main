import React from "react";
import Reveal from "./Reveal";

/* ---------------- BADGE (INLINE COMPONENT) ---------------- */
function Badge({ children, variant = "default", className = "" }) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";

  const variants = {
    default: "border-transparent bg-black text-white",
    secondary: "border-transparent bg-gray-200 text-gray-900",
    destructive: "border-transparent bg-red-500 text-white",
    outline: "text-gray-900",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

/* ---------------- FEATURE SECTION ---------------- */
export default function Feature() {
  return (
    <Reveal>

      <div className="w-full py-20 lg:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-10">

            {/* Header */}
            <div className="flex flex-col gap-4 items-start">

              <div className="flex flex-col gap-2">
                <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-normal text-left">
                  Power illustration
                </h2>
                <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-gray-500 text-left">

                  Revolutionizing the Battery Storage Landscape of India
                </p>
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Text Card (Wide) */}
              <div className="bg-[#fbf7f1] rounded-2xl lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
                <div>
                  <h3 className="text-xl tracking-tight">
                    Pay supplier invoices
                  </h3>
                  <p className="text-gray-500 max-w-xs text-base">
                  Infinity Energy is revolutionizing India's energy future with advanced Battery Energy Storage Systems (BESS) utilizing cutting-edge technology and world-class infrastructure. Focused on indigenizing BESS solutions for renewable energy integration, grid stabilization, and enhanced energy reliability, the company serves residential, commercial, and industrial sectors.
                  </p>
                </div>
              </div>

              {/* Image Card */}
              <div className="bg-[#fbf7f1] rounded-2xl aspect-square p-2 flex">
                <img
                  src="https://www.voltra.in/assets/power-DIgSKEdl.png"
                  alt="Feature illustration"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Image Card (Same Height – FIXED) */}
              <div className="bg-[#fbf7f1] rounded-2xl aspect-square p-2 flex">
                <img
                  src="https://images.unsplash.com/photo-1506765515384-028b60a970df?w=1600&q=80&auto=format&fit=crop"
                  alt="Feature illustration"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Text Card (Wide) */}
              <div className="bg-[#fbf7f1] rounded-2xl lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
                <div>
                  <h3 className="text-xl tracking-tight">
                    Pay supplier invoices
                  </h3>
                  <p className="text-gray-500 max-w-xs text-base">
                    Our goal is to streamline SMB trade, making it easier and faster
                    than ever.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Reveal>

  );
}
