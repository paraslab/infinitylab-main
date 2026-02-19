import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSinglePremium from "../components/HeroSlider.jsx";
import ContactInfoBar from "../components/ContactInfoBar.jsx";
import ContactForm from "../components/ContactForm.jsx";
import MapSection from "../components/MapSection.jsx";
import SocialFloating from "../components/SocialFloating";




const heroImage = "https://backend.infinityenergy.xyz/uploads/media/contact_hero.webp";
export default function Contact() {
  return (
    <>
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