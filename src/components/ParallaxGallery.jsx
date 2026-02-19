import React, { useEffect, useRef } from "react";


const images = [
  { src: "https://framerusercontent.com/images/TZYfRSkWPCYlK8Z1YU0Hpt1setk.jpg", span: "md:col-span-2", h: "h-[320px]" },
  { src: "https://framerusercontent.com/images/TZYfRSkWPCYlK8Z1YU0Hpt1setk.jpg", span: "", h: "h-[420px]" },
  { src: "https://framerusercontent.com/images/TZYfRSkWPCYlK8Z1YU0Hpt1setk.jpg", span: "", h: "h-[300px]" },
  { src: "https://framerusercontent.com/images/TZYfRSkWPCYlK8Z1YU0Hpt1setk.jpg", span: "md:col-span-1", h: "h-[360px]" },
  { src: "https://framerusercontent.com/images/TZYfRSkWPCYlK8Z1YU0Hpt1setk.jpg", span: "", h: "h-[380px]" },
  { src: "https://framerusercontent.com/images/TZYfRSkWPCYlK8Z1YU0Hpt1setk.jpg", span: "", h: "h-[320px]" },
];
export default function ParallaxGallery() {
     const itemsRef = useRef([]);

     useEffect(() => {
          let rafId;

          const handleScroll = () => {
               rafId = requestAnimationFrame(() => {
                    itemsRef.current.forEach((el, index) => {
                         if (!el) return;

                         const rect = el.getBoundingClientRect();
                         const windowHeight = window.innerHeight;

                         // progress from -1 to 1
                         const progress =
                              (rect.top - windowHeight) / (windowHeight + rect.height);

                         const speed = (index % 3 + 1) * 90; // px movement
                         el.style.transform = `translateY(${progress * speed}px)`;
                    });
               });
          };

          window.addEventListener("scroll", handleScroll, { passive: true });
          handleScroll(); // initial position

          return () => {
               window.removeEventListener("scroll", handleScroll);
               cancelAnimationFrame(rafId);
          };
     }, []);

     return (
          <section className="py-24 px-4 overflow-hidden">
               <div className="max-w-7xl mx-auto">
                    {/* Heading */}
                    <div className="text-center mb-16">
                         <h2 className="text-3xl md:text-4xl font-semibold">
                              Our Gallery
                         </h2>
                         <p className="mt-3 text-gray-600">
                              A glimpse into our craftsmanship and excellence
                         </p>
                    </div>

                    {/* Gallery */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                         {images.map((item, i) => (
                              <div
                                   key={i}
                                   ref={(el) => (itemsRef.current[i] = el)}
                                   className={`
        relative overflow-hidden
        rounded-[32px]
        shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        will-change-transform
        ${item.h}
        ${item.span}
      `}
                              >
                                   <img
                                        src={item.src}
                                        alt=""
                                        className="
          absolute inset-0 w-full h-full
          object-cover scale-110
          transition-transform duration-700
        "
                                   />
                              </div>
                         ))}
                    </div>

               </div>
          </section>
     );
}
