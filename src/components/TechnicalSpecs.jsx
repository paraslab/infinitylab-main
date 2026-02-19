import { motion } from "framer-motion";
import {
  Beaker,
  Droplet,
  Snowflake,
  Ban,
  Flame,
  Sparkles,
} from "lucide-react";

const specs = [
  { label: "Chemical Resistance", icon: Beaker },
  { label: "Water Resistance", icon: Droplet },
  { label: "Frost Resistance", icon: Snowflake },
  { label: "Scratch Resistance", icon: Ban },
  { label: "Fire Resistance", icon: Flame },
  { label: "Easy To Clean", icon: Sparkles },
];

export default function TechnicalSpecs() {
  return (
    <section className="w-full py-20 overflow-hidden px-8 md:px-16 lg:px-28">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Title */}
        <h2 className="text-4xl font-semibold mb-14">
          Technical Specification
        </h2>

        {/* Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10">
          {specs.map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  x: i < 3 ? -60 : 60, // LEFT & RIGHT reveal
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center">
                  <Icon className="w-7 h-7 text-black" />
                </div>

                <p className="text-sm font-medium tracking-wide text-gray-900 uppercase">
                  {item.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
