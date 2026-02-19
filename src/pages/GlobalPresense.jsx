import React from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import HeroSinglePremium from "../components/HeroSlider.jsx";
import WorldMap from "../components/InteractiveMap.jsx";
import GlobalFootprint from "../components/GlobalFootprint.jsx"
import InternationalPresence from "./InternationalPresence.jsx"
import SustainabilityQualityCard from "./SectionImage.jsx"
import QuoteCard from "../components/QuoteCard2.jsx";
import SocialFloating from "../components/SocialFloating.jsx";


const heroImage = "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=1600&q=80&auto=format&fit=crop";
export default function Contact() {
  return (
    <>
      <Header />
      <main className="pt-0 px-4 md:px-4 space-y-8">
        <section>
          <HeroSinglePremium
            image={heroImage}
            title="Global Presence"
            subtitle="Read our latest articles, news, and updates on various topics."
          />
        </section>

        <section className="w-full flex justify-center py-20 ">
          <div className="relative max-w-xl w-full bg-[#F7F2EA] rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.06)] p-8 sm:p-10">
            {/* Floating logo top-right */}
            <div className="absolute -top-5 -right-5 w-11 h-11 bg-black rounded-xl flex items-center justify-center shadow-lg">
              <img
                src="https://framerusercontent.com/images/spfOSmDREC26YmpSFS1EN7rf6U.png"
                alt="logo"
                className="w-5 h-5 invert"
              />
            </div>

            {/* Badge */}
            <div className="inline-block mb-6">
              <span className="text-xs font-medium px-3 py-1 rounded-lg bg-black/5 text-gray-800">
                Arteleaf
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl font-medium tracking-tight leading-[1.1] text-black mb-6">
              Turning content chaos into{" "}
              <span className="italic font-serif tracking-tight">
                consistent
              </span>{" "}
              growth
            </h2>

            {/* Text */}
            <div className="space-y-4 text-[15px] leading-relaxed text-black/60">
              <p>
                What began as small exports from Morbi has today transformed into long-term relationships with distributors and importers across the globe. </p>
              <p>
                As a trusted manufacturer and exporter of ceramic tiles & porcelain tiles, LAXRIQ has built a strong and growing presence in international markets. From the heart of Morbi, Gujarat — the hub of India’s ceramic and tile industry — we proudly serve clients across continents with products that match global standards.
              </p>
            </div>

            {/* Bottom brand */}
            <div className="mt-8 flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
                <img
                  src="https://framerusercontent.com/images/spfOSmDREC26YmpSFS1EN7rf6U.png"
                  alt="logo"
                  className="w-3 h-3 invert"
                />
              </div>
              <span className="text-lg font-medium tracking-tight">viral</span>
            </div>
          </div>
        </section>

        <section>
          <WorldMap />
        </section>

        <section>
          <InternationalPresence/>
        </section>
        {/* <section>
          <GlobalFootprint />
        </section> */}

        <section>
          <SustainabilityQualityCard
            image="https://backend.infinityenergy.xyz/uploads/media/GlobalPresense1.webp"
            title="Built on Trust. "
            subtitle="Delivered with Integrity."
            points={[
              "Over the years, we’ve developed lasting relationships with distributors and importers, real estate and construction companies, tile retailers and wholesalers.",
              "From first inquiry to final shipment — we prioritize professionalism, transparency, and long-term value.",
            ]}
          />

        </section>


        <section>
          <QuoteCard
            quote="Wherever there’s demand for top-quality Indian ceramics, LAXRIQ is ready to serve."
            name="AretLeaf Group"
          />
        </section>
      </main>
      <SocialFloating />
      <Footer />
    </>

  )
}