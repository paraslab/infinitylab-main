import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSinglePremium from "../components/HeroSlider.jsx";
import FeatureHighlights from "../components/FeatureHighlights.jsx";
import Reveal from '../components/Reveal.jsx';
import QuoteCard from "../components/QuoteCard2";
import SocialFloating from "../components/SocialFloating";
import TwoColCards from "../components/TwoColInfoCards.jsx";
import MissionCard from "../components/MissionCard.jsx";
import FullScreenImage from "../components/FullScreenImage.jsx";
import model from "../assets/images/model.png"



const heroImage = "https://backend.infinityenergy.xyz/uploads/media/microgrid_hero.webp";


export default function Contact() {
  return (
    <>
      <Header />
      <main className="pt-0 px-4 md:px-4 space-y-8">
        <section>
          <HeroSinglePremium
            image={heroImage}
            title="Microgrid Mode"
            subtitle="Smart microgrids with integrated BESS deliver reliable, independent power for communities and facilities, seamlessly maintaining electricity during grid outages.
They optimize local energy sources to improve resilience, efficiency, and energy control."
          />
        </section>
        <section>
          <FeatureHighlights />
        </section>
        <section>
          <MissionCard
            badge="Infinity"
            title="A Reliable Power "
            highlight="Solution"
            brandLink="/about"
            description={[
              "As the name suggests, Microgrid Mode allows multiple energy sources (solar, battery, DG, grid) to work together as one smart system for stable power.",
              "Microgrid Mode improves reliability by balancing load and generation automatically, ensuring uninterrupted supply even during grid fluctuations.",
              "It can operate in both grid-connected and off-grid conditions, seamlessly switching modes based on availability and demand.",
              "With intelligent control, Microgrid Mode optimizes energy usage by prioritizing solar, storing excess in BESS, and using grid/DG only when required.",
            ]}
          />
        </section>
        <section>
          <FullScreenImage
            src={model}
            alt="Infinity Energy"
          />
        </section>

        <section>
          <TwoColCards
            items={[
              {
                title: "HYBRID",
                description:
                  "Hybrid energy systems combine multiple sources for higher reliability and efficiency.",
                link: "/solutions/hybrid-mode",
              },
              {
                title: "ISLAND",
                description:
                  "Island mode allows energy systems to operate independently from the main grid, ensuring uninterrupted power during outages.",
                link: "/solutions/island-mode",
              },
            ]}
          />

        </section>

        <section>
          <QuoteCard
            quote="We offer tailored customization to meet your needs.
Share your requirements with us."
            name="Infinity Energy"
            link="/contact"
            linkText="GET IN TOUCH"
          />
        </section>
      </main>
      <SocialFloating />
      <Footer />
    </>
  )
}