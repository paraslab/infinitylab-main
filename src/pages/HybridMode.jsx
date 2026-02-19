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



const heroImage = "https://backend.infinityenergy.xyz/uploads/media/hybrid_hero.webp";


export default function Contact() {
  return (
    <>
      <Header />
      <main className="pt-0 px-4 md:px-4 space-y-8">
        <section>
          <HeroSinglePremium
            image={heroImage}
            title="Hybrid Mode"
            subtitle="Hybrid Mode integrates multiple energy sources like Grid, Solar PV, Generators, etc., and helps in enhancing the overall efficiency and reliability of the system."
          />
        </section>
        <section>
          <FeatureHighlights />
        </section>
        <section>
          <MissionCard
            badge="Infinity"
            title="Your Smart Energy "
            highlight="Partner"
            brandLink="/about"
            description={[
              "With a setup called 'hybrid working,' energy sources like generators can be used in combination with Battery Energy Storage System, which stores energy in lean hours and provides energy in peak hours.",
            "Imagine you're at a construction site, where work never stops. A lot is going on, and the need for electricity changes all the time—more in the morning, less at night.",
            "Hybrid working not only reduces the cost of energy but also makes it more reliable and sustainable.",
          "Here's how it works: When there's a lot of demand for power, like in the morning when everyone's starting their day, the ESS kicks in. It saves extra electricity to use later, so we don't have to rely too much on expensive power from the grid. Then, when it's quieter at night and we don't need as much energy, the stored power gets used efficiently."]}
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
  title: "ISLAND",
  description:
    "Island mode allows energy systems to operate independently from the main grid, ensuring uninterrupted power during outages.",
  link: "/solutions/island-mode",
},
              {
                title: "MICROGRID",
                description:
                  "Localized energy systems that improve resilience and sustainability.",
                link: "/solutions/microgrid-mode",
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