import React from "react";


export default function AboutGridSection() {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="max-w-7xl mx-auto  sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-8 lg:gap-10">
            {/* Image */}
            <div className="bg-[#FFFAFA] shadow-xl p-3 rounded-3xl overflow-hidden shadow-lg">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl h-[220px] sm:h-[280px] md:h-[380px] lg:h-[620px]">
                <img
                  src="https://backend.infinityenergy.xyz/uploads/media/about_1.webp"
                  alt="About"
                  loading="lazy"
                  className="w-full h-full object-cover transition duration-[2000ms] hover:scale-105"
                />
              </div>
            </div>

            {/* Card */}
            <div className="bg-[#FFFAFA] shadow-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3 sm:mb-4">
                infinity
              </p>

              <h3 className="text-2xl sm:text-3xl md:text-4xl  leading-tight mb-3 sm:mb-4">
                What We Do
              </h3>

              <ul className="list-disc pl-5 sm:pl-6 text-gray-600 text-sm sm:text-base space-y-2 mb-5 sm:mb-6">
                <li>Home & commercial inverter backup systems</li>
                <li>Mission-critical UPS applications</li>
                <li>Commercial & industrial BESS projects</li>
                <li>Solar energy storage solutions</li>
              </ul>

              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our focus goes beyond supplying batteries. We emphasize correct system sizing, inverter and UPS compatibility, safety, and long-term performance.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}

          <div className="flex flex-col gap-8 lg:gap-10">
            {/* Card */}

            <div className="bg-[#FFFAFA] shadow-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3 sm:mb-4">
                About Us
              </p>

              <h3 className="text-2xl sm:text-3xl md:text-4xl leading-tight mb-3 sm:mb-4">
                Powering India with Smart  <br />  Lithium Energy Solutions
              </h3>

              <p className="text-gray-600 leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">
                Infinity Energy is an India-focused energy solutions company specializing in trading, distribution, and system integration of Lithium Battery solutions for Inverter, UPS, BESS, and Solar applications. We are built to bridge the gap between advanced lithium technology and practical Indian power requirements.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">
                India’s power ecosystem presents unique challenges—frequent power cuts, voltage fluctuations, rising electricity costs, and increasing solar adoption. At Infinity Energy, we address these challenges by delivering application-specific lithium battery solutions that perform reliably under real Indian operating conditions.
              </p>


            </div>

            {/* Image */}
            <div className="bg-[#FFFAFA] shadow-xl p-3 rounded-3xl overflow-hidden shadow-lg">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl h-[220px] sm:h-[280px] md:h-[380px] lg:h-[500px]">
                <img
                  src="https://backend.infinityenergy.xyz/uploads/media/about_1.2.webp"
                  alt="Products"
                  loading="lazy"
                  className="w-full h-full object-cover transition duration-[2000ms] hover:scale-105"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
