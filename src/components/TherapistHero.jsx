import React from "react";

export default function TherapistHero({
  image = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
  name = "Nadine",
}) {
  return (
    <section className="w-full min-h-screen  flex items-center justify-center p-6 sm:p-12">
      <div className="max-w-9xl w-full relative">
        
        {/* Main Dark Container */}
        <div className="bg-[#0F111A] rounded-[40px] flex flex-col lg:flex-row items-center min-h-[400px] ml-0 lg:ml-20 pr-8 lg:pr-16 py-16 lg:py-0">
          
          {/* IMAGE SECTION - Positioned to hang off the left */}
          <div className="relative lg:absolute lg:-left-38 lg:bottom-[-20px] mb-12 lg:mb-0">
            {/* The Gold Arch Border */}
            <div className="absolute -top-4 -left-4 -right-4 bottom-0 border border-[#A68B67] rounded-t-[200px] pointer-events-none z-20" />
            
            {/* The Arched Image Container */}
            <div className="relative w-[300px] sm:w-[380px] h-[450px] sm:h-[550px] overflow-hidden rounded-t-[200px] shadow-2xl z-10">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover grayscale-[10%] hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="flex-1 lg:pl-[500px] text-left">

            {/* Heading */}
            <h2 className="text-4xl lg:text-5xl font-serif text-white mb-8 tracking-tight">
              I’m Here To Serve You
            </h2>

            {/* Quote */}
            <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-xl italic">
              "Hi, I’m {name}, a spiritual counsellor helping you find peace,
              meaning, and deeper connection in life. Whether you’re seeking
              healing, spiritual growth, or a renewed sense of purpose, I’m here
              to support you on your journey."
            </p>

            {/* Credentials */}




          </div>
        </div>

      </div>
    </section>
  );
}