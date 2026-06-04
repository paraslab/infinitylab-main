import React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import MissionVisionCard from '../components/MissionVisionCard.jsx';
import ValueCard from '../components/ValueCard.jsx';
import HeroSinglePremium from "../components/HeroSlider.jsx";
import AboutGridSection from '../components/AboutSection.jsx'
import CertificationsSection from '../components/Certifications.jsx';
import Reveal from '../components/Reveal.jsx';
import ParallaxGallery from "../components/ParallaxGallery";
import { ZoomParallax } from "../components/zoom-parallax";
import SocialFloating from "../components/SocialFloating";
import Seo from "../components/Seo";

const heroImage = "https://backend.infinityenergy.xyz/uploads/media/about_hero.webp";
const missionImg = "https://framerusercontent.com/images/TZYfRSkWPCYlK8Z1YU0Hpt1setk.jpg";
const visionImg = "https://framerusercontent.com/images/TZYfRSkWPCYlK8Z1YU0Hpt1setk.jpg";

const images = [
  {
    src: "https://backend.infinityenergy.xyz/uploads/media/AboutZoom1.webp",
    alt: "Modern architecture building",
  },
  {
    src: "https://backend.infinityenergy.xyz/uploads/media/AboutZoom2.webp",
    alt: "Urban cityscape at sunset",
  },
  {
    src: "https://backend.infinityenergy.xyz/uploads/media/AboutZoom3.webp",
    alt: "Abstract geometric pattern",
  },
  {
    src: "https://backend.infinityenergy.xyz/uploads/media/AboutZoom4.webp",
    alt: "Mountain landscape",
  },
  {
    src: "https://backend.infinityenergy.xyz/uploads/media/AboutZoom5.webp",
    alt: "Minimalist design elements",
  },
  {
    src: "https://backend.infinityenergy.xyz/uploads/media/AboutZoom6.webp",
    alt: "Ocean waves and beach",
  },
  {
    src: "https://backend.infinityenergy.xyz/uploads/media/AboutZoom7.webp",
    alt: "Forest trees and sunlight",
  },
];


export default function About() {
  return (

    <>
      <Seo
        title="About Infinity Energy - Lithium Energy Storage Experts"
        description="Learn about Infinity Energy's mission, vision, and expertise in lithium energy storage solutions across India."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Infinity Energy",
          "url": "https://www.infinityenergy.xyz",
          "logo": "https://www.infinityenergy.xyz/favicon.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-88661-89016",
            "contactType": "customer service"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Surat",
            "addressRegion": "Gujarat",
            "addressCountry": "IN"
          },
          "email": "Info@infinityenergy.xyz"
        }}
      />
      <Header />
      <main className="pt-0 px-4 md:px-4 space-y-8">
        <section>
          <HeroSinglePremium
            image={heroImage}
            title="About Us"
            subtitle="Learn more about our mission, values, and the team behind our success."
          />
        </section>
        <Reveal>
          <AboutGridSection />
        </Reveal>
        <MissionVisionCard
          icon="🎯"
          title="Our Mission"
          text=" To make lithium energy storage accessible, understandable, and dependable across India by providing technically correct, transparently priced, and application-optimized solutions."
          author="Infinity Energy"
          image={missionImg}
        />
        <MissionVisionCard
          icon="🌍"
          title="Our Vision"
          text="To become a trusted Indian brand for lithium battery trading and energy storage solutions, supporting India’s transition toward efficient, reliable, and intelligent power systems."
          author="Infinity Energy"
          image={visionImg}
          reverse
        />
        <section>
          <ValueCard/>
        </section>
        {/* <Reveal>
          <CertificationsSection />
        </Reveal> */}
        <section>
          <div className="relative flex h-[5vh] items-center justify-center">
            <h1 className="text-4xl font-bold">INSIGHTS</h1>
          </div>
          <ZoomParallax images={images} />

          <div className="h-[5vh]" />
        </section>

      </main>
      <SocialFloating />
      <Footer />
    </>

  )
}

