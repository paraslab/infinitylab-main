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
const heroImage = "https://backend.infinityenergy.xyz/uploads/media/island_hero.webp";


export default function Contact() {
     return (
          <>
               <Header />
               <main className="pt-0 px-4 md:px-4 space-y-8">
                    <section>
                         <HeroSinglePremium
                              image={heroImage}
                              title="Island Mode"
                              subtitle="Island BESS are commonly found in remote areas such as rural towns and mine sites, where access to the utility grid is limited. Island micro grids connected with BESS often serve as backup or standby generators to provide electricity during grid failures."
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
                                   "As the name suggests, Island Mode allows you to generate and use energy independently. Although it also has the flexibility to stay connected with the grid for benefits like net metering.",
                                   "Energy Storage System-connected Island Mode energy stations are more reliable as Excess energy can be stored in BESS and used anytime and anywhere.",
                                   "Despite its name, islanding doesn't disconnect your home from the grid entirely. Instead, it allows you to stay connected for benefits like net metering.",
                                   "Even with solar and storage installed, your home maintains this connection, ensuring you can still draw power from the grid when needed, such as during the night when solar panels aren't producing.",
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