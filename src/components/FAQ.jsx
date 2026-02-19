import { useState } from "react";
import { HiPlus, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const companies = [
  {
    title: "What is a Battery Energy Storage System (BESS)?",
    content: (
      <>
        <p className="mb-4 text-gray-600">
          A Battery Energy Storage System (BESS) is a technology that stores energy for later use. It allows energy to be captured during times of low demand or when renewable energy sources like solar or wind are abundant, and then released during peak demand or when renewable energy production is low.
        </p>
      </>
    ),
  },
  {
    title: "How does a BESS work?",
    content: (
      <>
        <p className="mb-4 text-gray-600">
          A BESS works by converting electrical energy to chemical energy for storage in batteries. When electricity is needed, the chemical energy is converted back to electrical energy. The system includes batteries, a power conversion system (inverter), and controls to manage charging and discharging cycles efficiently.
        </p>
      </>
    ),
  },
  {
    title: "What are the benefits of using a BESS?",
    content: (
      <>
        <p className="mb-4 text-gray-600">
          Benefits include energy cost savings, backup power during outages, grid stability support, peak demand reduction, integration of renewable energy sources, reduced carbon footprint, and potential revenue through energy arbitrage or grid services.
        </p>
      </>
    ),
  }, {
    title: "What types of batteries are used in a BESS?",
    content: (
      <>
        <p className="mb-4 text-gray-600">
          Common battery technologies include lithium-ion (most popular for commercial BESS), lead-acid, flow batteries, sodium-sulfur, and emerging technologies like solid-state batteries. Each type has different characteristics in terms of energy density, cycle life, and cost.
        </p>
      </>
    ),
  },
];

export default function OurCompanies() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-8 px-0">
      <div className="relative max-w-4xl mx-auto bg-[#FFFAFA] shadow-xl rounded-2xl p-6 md:p-10">



        <h2 className="text-3xl md:text-4xl  mb-3">
          KNOW ABOUT BESS
        </h2>

        <p className="text-gray-600 mb-10 max-w-2xl">
          Have any more queries?
        </p>

        <div className="space-y-5">
          {companies.map((company, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-[#f1eee7] rounded-2xl p-5 md:p-6"
              >
                {/* Header */}
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex justify-between items-center w-full text-left gap-4"
                >
                  <span className="font-bold text-base md:text-lg">
                    {company.title}
                  </span>

                  {/* Plus / Close Icon */}
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="
                      w-8 h-8
                      flex items-center justify-center
                      bg-black text-white
                      rounded-full md:rounded-md
                      transition-transform active:scale-95
                    "
                  >
                    {isOpen ? <HiX size={16} /> : <HiPlus size={16} />}
                  </motion.span>
                </button>

                {/* Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden mt-5"
                    >
                      {company.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
