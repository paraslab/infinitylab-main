import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSinglePremium from "../components/HeroSlider.jsx";
import ContactInfoBar from "../components/ContactInfoBar.jsx";
import ContactForm from "../components/ContactForm.jsx";
import MapSection from "../components/MapSection.jsx";
import SocialFloating from "../components/SocialFloating";
import Seo from "../components/Seo";




const heroImage = "https://backend.infinityenergy.xyz/uploads/media/contact_hero.webp";
export default function Contact() {
  return (
    <>
      <Seo
        title="Contact Infinity Energy — Get a Clean Power Quote"
        description="Talk to Infinity Energy about lithium batteries, solar energy storage, and power backup. Get a quote — call +91 88661 89016 or email Info@infinityenergy.xyz."
      />
      <Header />

      <main className="pt-0 px-4 md:px-4 space-y-8">

        <section>
          <HeroSinglePremium
            image={heroImage}
            title="Contact us"
            subtitle="We'd love to hear from you. Reach out with any questions or inquiries."
          />
        </section>
        <section className="relative ">
          <ContactInfoBar />
        </section>
        <section>
          <ContactForm />
        </section>
        <section>
          <MapSection />
        </section>





      </main>
      <SocialFloating />
      <Footer />
    </>

  )
}