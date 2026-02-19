import React from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import HeroSinglePremium from "../components/HeroSlider.jsx";
import GroupHistory from "../Mode.jsx";
import ScrollTimeline from "../components/ScrollTimeline.jsx"
import FAQ from "../components/FAQ.jsx";
import Reveal from '../components/Reveal.jsx';
import QuoteCard from "../components/QuoteCard2.jsx";
import SocialFloating from "../components/SocialFloating.jsx";


const heroImage = "https://backend.infinityenergy.xyz/uploads/media/GroupofCompaniesHero1.webp";
const events = [
  {
    year: "2016",
    title: "Luxurico Ceramic LLP",
    subtitle: "Foundation",
    description:
      "Established manufacturing excellence in premium ceramic and porcelain tiles.",
    image: "https://backend.infinityenergy.xyz/uploads/media/GroupofCompaniesLuxurico.webp",
  },
  {
    year: "2019",
    title: "Elista Exim",
    subtitle: "Global Expansion",
    description:
      "Strengthened international exports across tiles, marble, and sanitary ware.",
    image: "https://backend.infinityenergy.xyz/uploads/media/GroupofCompaniesElista.webp",
  },
  {
    year: "2023",
    title: "Laxriq",
    subtitle: "Flagship Brand",
    description:
      "Unified strength, global partnerships, and premium export solutions.",
    image: "https://backend.infinityenergy.xyz/uploads/media/GroupofCompaniesLaxriq.webp",
  },
];

export default function Contact() {
  return (
    <>
      <Header />
      <main className="pt-0 px-4 md:px-4 space-y-8">
        <section>
          <HeroSinglePremium
            image={heroImage}
            title="GROUP COMPANIES"
            subtitle="Read our latest articles, news, and updates on various topics."
          />
        </section>
        <section>
          <Reveal>
            <div className="relative z-10 -mt-56 md:-mt-56 lg:-mt-64">
              <GroupHistory />
            </div>
          </Reveal>
        </section>
        <section>
          <ScrollTimeline
            title="Our Journey"
            subtitle="Milestones that shaped us"
            events={events}
          />
        </section>
        {/* <section>
          <FAQ />
        </section> */}

        <section>
          <QuoteCard
            quote="Whether you’re an architect, importer, wholesaler, or developer, partnering with us means access to world-class ceramic products made in India with pride and precision."
            name="AretLeaf Group"
          />
        </section>


      </main>
      <SocialFloating />
      <Footer />
    </>
  )
}