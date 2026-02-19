// src/components/Footer.jsx
import React from "react";
import PropTypes from "prop-types";
import footerHero from "../assets/images/solarta_footer_base.jpg";

export default function Footer({
  heroImage = footerHero,
  logo = {
    src: "https://solarta.deothemes.com/wp-content/uploads/2022/08/solarta_logo_white@2x.png",
    alt: "Solarta",
    href: "/",
  },
  menuLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/contact", label: "Contact" },
    { href: "/shop", label: "Shop" },
  ],
  address = "Philippines,<br/>Greenwich st. 256/6, 62058",
  phone = "+1 888 1554 456 123",
  email = "solartasupport@gmail.com",
  subscribeText = 'Get Fresh Updates.<br/><a href="#">Just Subscribe</a>',
  copyrightText = '© 2025 Solarta | Made by <a href="https://deothemes.com/" target="_blank" rel="noopener noreferrer">DeoThemes</a>',
  socialLinks = [],
}) {
  return (
    <footer className="bg-[#1c1c1c] text-gray-100">
      <div
        className="w-full "
      >

        {/* ===== FULLSCREEN HERO ===== */}
        <div className="relative w-full h-[500px] overflow-hidden ">

          {/* Image with Bottom → Top Fade (MASK) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImage})`,
              WebkitMaskImage:
                "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.6) 25%, black 60%)",
              maskImage:
                "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.6) 25%, black 60%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-semibold text-white leading-snug">
                We implement your ideas.
                <br />
                Let's talk.
              </h2>

              <div className="mt-8">
                <a
                  href="#"
                  className="inline-block bg-[#4C8C4A] hover:bg-[#3b6e39] text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-[0_16px_36px_rgba(76,140,74,0.20)] transform transition duration-300 hover:-translate-y-1"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>


        {/* <div className="relative w-full  h-[500px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center "
            style={{ backgroundImage: `url(${heroImage})` }}
            role="img"
            aria-label="Footer background"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(34,28,21,0.20) 40%, #1c1c1c 90%)",
            }}
          />
          <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-semibold text-white leading-snug">
                We implement your ideas.
                <br />
                Let's talk.
              </h2>
              <div className="mt-8">
                <a
                  href="#"
                  className="inline-block bg-[#4C8C4A] hover:bg-[#3b6e39] text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-[0_16px_36px_rgba(76,140,74,0.20)] transform transition duration-300 hover:-translate-y-1"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div> */}

        {/* SMOOTH TRANSITION STRIP */}
        <div
          aria-hidden="true"
          className="w-full"
          style={{
            height: 60,
            marginTop: -4,
          }}
        />

        {/* ===== FOOTER CONTENT ===== */}
        <div
          className="max-w-7xl mx-auto px-6 pt-14 pb-20"
        >

          {/* Logo + Menu */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <a href={logo.href}>
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-[130px] object-contain"
                loading="lazy"
              />
            </a>

            <nav>
              <ul className="flex flex-wrap justify-center md:justify-end gap-8 text-sm">
                {menuLinks.map((m) => (
                  <li key={m.href}>
                    <a href={m.href} className="text-gray-300 hover:text-white">
                      {m.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-10"></div>

          {/* 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
            <div dangerouslySetInnerHTML={{ __html: address }} />

            <div className="text-center md:text-left space-y-2">
              <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
              <br />
              <a href={`mailto:${email}`} className="hover:underline">{email}</a>
            </div>

            <div className="text-right" dangerouslySetInnerHTML={{ __html: subscribeText }} />
          </div>

          {/* Bottom Row */}
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div
              className="text-sm text-gray-400"
              dangerouslySetInnerHTML={{ __html: copyrightText }}
            />

            <div className="flex gap-4">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 hover:bg-gray-800 transition"
                  aria-label={s.label}
                  title={s.label}
                >
                  <span className="text-gray-200">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  logo: PropTypes.object,
  menuLinks: PropTypes.array,
  address: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  subscribeText: PropTypes.string,
  copyrightText: PropTypes.string,
  socialLinks: PropTypes.array,
};
