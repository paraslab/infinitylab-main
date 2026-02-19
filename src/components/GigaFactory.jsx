import React from "react";
import {
  FaVials,
  FaProjectDiagram,
  FaCogs,
  FaFlask,
} from "react-icons/fa";

export default function GigaFactory() {
  return (
    <section className="px-0 py-1 md:py-2">
      <div
        className="
          max-w-8xl mx-auto
          bg-[#1E2A24]
          rounded-2xl md:rounded-2xl
          overflow-hidden
        "
      >
        <div className="grid md:grid-cols-2">
          
          {/* LEFT CONTENT */}
          <div className="text-white px-6 md:px-16 py-10 md:py-14 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl leading-tight">
              The Infinity
              <span className="block italic text-white/70 mt-2">
                GigaFactory
              </span>
            </h2>

            <p className="mt-5 text-sm md:text-base text-white/80 leading-relaxed max-w-xl">
              An advanced manufacturing facility focused on producing
              cutting-edge electric vehicle (EV) batteries and energy
              storage solutions.
            </p>

            <p className="mt-4 text-sm md:text-base text-white/80 leading-relaxed max-w-xl">
              Strategically located to support sustainable energy and
              transportation innovations.
            </p>

            {/* FEATURES */}
            <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
              <Feature icon={<FaVials />} title="Robust Testing" />
              <Feature icon={<FaProjectDiagram />} title="Data Integration" />
              <Feature icon={<FaCogs />} title="Intelligent Production" />
              <Feature icon={<FaFlask />} title="R&D Lab" />
            </div>

            {/* CTA */}
            <a
              href="#"
              className="
                inline-block mt-8 w-fit
                bg-white text-[#1E2A24]
                px-6 py-3 rounded-2xl
                text-sm font-medium
                hover:bg-white/90 transition
              "
            >
              Explore the GigaFactory
            </a>
          </div>

          {/* IMAGE */}
          <div
            className="
              relative w-full
              h-[260px] sm:h-[320px]
              md:h-auto md:min-h-[520px]
            "
          >
            <img
              src="https://backend.infinityenergy.xyz/uploads/media/home_giga.webp"
              alt="GigaFactory"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* RESPONSIVE GRADIENT LAYER */}
            <div
              className="
                absolute inset-0
                bg-gradient-to-b
                from-[#1E2A24]
                via-[#1E2A24]/70
                to-transparent
                md:bg-gradient-to-r
                md:from-[#1E2A24]
                md:via-[#1E2A24]/70
                md:to-transparent
              "
            />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ================= Feature Item ================= */
function Feature({ icon, title }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3">
      <div className="text-lg text-white/90">{icon}</div>
      <span className="text-sm text-white/80">{title}</span>
    </div>
  );
}
