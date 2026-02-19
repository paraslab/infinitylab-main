import React from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import HeroSinglePremium from "../components/HeroSlider.jsx";
import MissionCard from "../components/MissionCard.jsx";
import QuoteCard from "../components/QuoteCard2.jsx";
import TechnicalSpecs from "../components/TechnicalSpecs.jsx";
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
            title="quality of arteleaf"
            subtitle=""
          />
        </section>

        <section>
          <MissionCard />
        </section>

        <section>
          <TechnicalSpecs />
        </section>

        <section>
          <QuoteCard
            quote="Ready to experience the Laxriq difference? Contact us today to request
samples, catalogues, or a custom quote."
            name="AretLeaf Group"
          />
        </section>
      </main>
      <SocialFloating />
      <Footer />
    </>
  )
}