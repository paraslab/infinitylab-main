"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Calendar } from "lucide-react";

/* simple class merge helper */
const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function ScrollTimeline({
     events = [],
     title = "Timeline",
     subtitle = "Scroll to explore the journey",
     parallaxIntensity = 0.2,
     progressLineWidth = 3,
     progressLineCap = "round",
     cardAlignment = "alternating",
     className = "",
}) {
     const containerRef = useRef(null);
     const [activeIndex, setActiveIndex] = useState(-1);

     const { scrollYProgress } = useScroll({
          target: containerRef,
          offset: ["start start", "end end"],
     });

     const smoothProgress = useSpring(scrollYProgress, {
          stiffness: 90,
          damping: 25,
     });

     const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

     const parallaxY = useTransform(
          smoothProgress,
          [0, 1],
          [parallaxIntensity * 120, -parallaxIntensity * 120]
     );

     useEffect(() => {
          return scrollYProgress.on("change", (v) => {
               setActiveIndex(Math.floor(v * events.length));
          });
     }, [events.length, scrollYProgress]);

     return (
          <div
               ref={containerRef}
               className={cn("relative min-h-screen overflow-hidden", className)}
          >
               {/* Header */}
               <div className="text-center py-16">
                    <h2 className="text-4xl font-bold">{title}</h2>
                    <p className="text-gray-500 mt-3">{subtitle}</p>
               </div>

               <div className="relative max-w-6xl mx-auto px-4 pb-24">
                    {/* Base line */}
                    <div
                         className="absolute top-0 left-1/2 -translate-x-1/2 h-full bg-gray-200"
                         style={{ width: progressLineWidth }}
                    />

                    {/* Progress line */}
                    <motion.div
                         className="absolute top-0 left-1/2 -translate-x-1/2"
                         style={{
                              height: progressHeight,
                              width: progressLineWidth,
                              borderRadius: progressLineCap === "round" ? 999 : 0,
                              background: "#087636",
                              boxShadow: "0 0 18px rgba(8,118,54,.45)",
                         }}
                    />

                    {/* Events */}
                    <div className="relative z-10">
                         {events.map((event, i) => (
                              <div
                                   key={i}
                                   className={cn(
                                        "relative flex mb-24",
                                        cardAlignment === "alternating"
                                             ? i % 2 === 0
                                                  ? "lg:justify-start"
                                                  : "lg:justify-end"
                                             : cardAlignment === "left"
                                                  ? "lg:justify-start"
                                                  : "lg:justify-end"
                                   )}
                              >
                                   {/* Dot */}
                                   <div className="absolute left-1/2 -translate-x-1/2 top-1/2">
                                        <motion.div
                                             className={cn(
                                                  "w-5 h-5 rounded-full bg-white border-4",
                                                  i <= activeIndex
                                                       ? "border-[#087636]"
                                                       : "border-gray-300"
                                             )}
                                             animate={i <= activeIndex ? { scale: [1, 1.4, 1] } : {}}
                                        />
                                   </div>

                                   {/* Card */}
                                   <motion.div
                                        style={{ y: parallaxY }}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: i * 0.15 }}
                                        viewport={{ once: true }}
                                        className="w-full lg:w-[45%]"
                                   >
                                        <div className="bg-[#fbf7f1] p-3 rounded-3xl overflow-hidden shadow-lg group">
                                             {/* Image */}
                                             {event.image && (
                                                  <div className="overflow-hidden rounded-3xl">
                                                       <img
                                                            src={event.image}
                                                            alt={event.title}
                                                            className="
            w-full h-[320px] object-cover
            transition-all duration-700
            group-hover:scale-105
          "
                                                       />
                                                  </div>
                                             )}

                                             {/* Content */}
                                             <div className="p-5">
                                                  {/* Accent */}
                                                  <div className="w-12 h-1 bg-[#087636] rounded-full mb-4" />

                                                  <div className="flex items-center gap-2 mb-2">
                                                       <Calendar className="w-4 h-4 text-[#087636]" />
                                                       <span className="font-semibold">{event.year}</span>
                                                  </div>

                                                  <h3 className="text-xl font-bold">{event.title}</h3>

                                                  {event.subtitle && (
                                                       <p className="text-gray-500 font-medium mt-1">
                                                            {event.subtitle}
                                                       </p>
                                                  )}

                                                  <p className="text-gray-600 mt-3">
                                                       {event.description}
                                                  </p>
                                             </div>
                                        </div>
                                   </motion.div>

                              </div>
                         ))}
                    </div>
               </div>
          </div>
     );
}
