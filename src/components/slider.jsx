import { useEffect, useState, useRef } from "react";

const slides = [
  {
    image:
      "https://backend.infinityenergy.xyz/uploads/media/home_hero_1.webp",
    heading: "Power That Never Lets You Down",
    description:
      "Infinity Energy batteries deliver reliable performance for vehicles, homes, and businesses.",
    ctaText: "Explore Batteries",
    ctaLink: "/productpage",
  },
  {
    image:
      "https://backend.infinityenergy.xyz/uploads/media/home_hero_2.webp",
    heading: "Built for Indian Conditions",
    description:
      "High-performance, low-maintenance batteries designed to handle heat, load, and long hours.",
    ctaText: "Explore Batteries",
    ctaLink: "/productpage"
  },
  {
    image:
      "https://backend.infinityenergy.xyz/uploads/media/home_hero_3.webp",
    heading: "Smart Energy. Strong Future.",
    description:
      "From automotive to inverter solutions, Infinity Energy powers what matters most.",
    ctaText: "Contact Infinity Energy",
    ctaLink: "/contact",
  },
];



export default function Slider({ autoPlay = true, interval = 50 }) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const timeoutRef = useRef(null);

  // 👉 reveal animation refs & state
  const sectionRef = useRef(null);
  const [show, setShow] = useState(false);

  const slideCount = slides.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slideCount);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slideCount) % slideCount);
  };

  // autoplay
  useEffect(() => {
    if (!autoPlay || isHovered) return;

    timeoutRef.current = setTimeout(nextSlide, interval);
    return () => clearTimeout(timeoutRef.current);
  }, [current, autoPlay, interval, isHovered]);

  // 👉 IntersectionObserver for section reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShow(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`
        relative w-full overflow-hidden rounded-3xl shadow-2xl
        mt-4 md:mt-4
        transform transition-all duration-[1800ms] ease-out
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Optional blur + scale wrapper */}
      <div
        className={`
          transition-all duration-[2200ms] ease-out
          ${show ? "blur-0 scale-100" : "blur-lg scale-110"}
        `}
      >
        {/* Slides */}
        <div className="relative h-[96vh] md:h-[96vh]">
          {slides.map((slide, index) => {
            const isActive = index === current;

            return (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.heading}
                  className={`w-full h-full object-cover transform transition-transform duration-[6000ms] ease-out ${
                    isActive ? "scale-100" : "scale-110"
                  }`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

                <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                  <div className="max-w-3xl text-white space-y-6">
                    <h1
                      className={`text-3xl md:text-5xl lg:text-6xl  leading-tight text-white/90
                      transform transition-all duration-700 ease-out
                      ${
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      }`}
                    >
                      {slide.heading}
                    </h1>

                    <p
                      className={`text-base md:text-lg text-white/90
                      transform transition-all duration-700 delay-150 ease-out
                      ${
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      }`}
                    >
                      {slide.description}
                    </p>

                    <div
                      className={`transform transition-all duration-700 delay-300 ease-out
                      ${
                        isActive
                          ? "opacity-100 translate-y-0 scale-100"
                          : "opacity-0 translate-y-6 scale-95"
                      }`}
                    >
                      <a
                        href={slide.ctaLink}
                        className="inline-block rounded-2xl bg-white text-black px-8 py-3  shadow-lg
                        hover:bg-neutral-200 hover:scale-105 transition-transform duration-300"
                      >
                        {slide.ctaText}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrows */}
        {/* <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-2xl bg-white/80 p-3 hover:bg-white hover:scale-110 transition"
        >
          ‹
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-2xl bg-white/80 p-3 hover:bg-white hover:scale-110 transition"
        >
          ›
        </button> */}

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === current
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
