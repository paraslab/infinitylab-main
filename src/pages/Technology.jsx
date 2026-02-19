import React from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import HeroSinglePremium from "../components/HeroSlider.jsx";
import TestingAnalysis from "../components/TestingAnalysis.jsx";
import Advantage from "../components/Advantage.jsx";
import TechnicalSpecs from "../components/TechnicalSpecs.jsx";
import SocialFloating from "../components/SocialFloating.jsx";

const heroImage = "https://backend.infinityenergy.xyz/uploads/media/technology_hero.webp";


export default function Contact() {
  return (
    <>
      <Header />
      <main className="pt-0 px-4 md:px-4 space-y-8">
        <section>
          <HeroSinglePremium
            image={heroImage}
            title="Infinity Tech"
            subtitle="Infinity Energy advances the future of energy storage through intelligent technology, sustainable design, and rigorous engineering—delivering reliable, high-performance energy solutions you can trust."
          />
        </section>
        <section>
          <TestingAnalysis/>
        </section>
        <section>
          <Advantage/>
        </section>
      </main>
      <SocialFloating />
      <Footer />
    </>
  )
}