import React, { useEffect, useState } from "react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaHome,
  FaEnvelope,
  FaLinkedinIn,
  FaBook,
} from "react-icons/fa";
import CartPill from "./CartPill"; // ← import the new component
import { useCart } from "../store/CartContext";

/* ================= Dock Icon (iOS style) ================= */
function DockIcon({ children, href, pulse, download }) {
  const isExternal = href.startsWith("http") || href.endsWith(".pdf");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel="noreferrer"
      download={download}
      aria-label="dock-icon"
      className={`
        text-gray-900 text-[1.35rem]
        transition-all duration-200
        hover:scale-110
        active:scale-90
        ${pulse ? "wp-pulse" : ""}
      `}
    >
      {children}
    </a>
  );
}

export default function SocialFloating() {
  const [visible, setVisible] = useState(false);

  /* ── live cart count from CartContext ── */
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + (i.qty || 0), 0);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ================= Desktop RIGHT (floating pills) ================= */}
      <div
        className={`
          hidden md:flex fixed bottom-6 right-6 z-50
          flex-col gap-3
          transition-all duration-700 ease-out
          ${visible
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-12 pointer-events-none"
          }
        `}
      >
        {/* Cart pill — desktop only */}
        <CartPill href="/store/quotation" cartCount={cartCount} visible={visible} variant="desktop" />

        {/* WhatsApp pill */}
        <a
          href="https://wa.me/918866189016"
          target="_blank"
          rel="noreferrer"
          className="
            flex items-center gap-2 rounded-xl
            bg-white/80 backdrop-blur-md
            px-4 py-2 shadow-lg
            hover:shadow-xl
            transition-all duration-300
            hover:-translate-y-1
          "
        >
          <FaWhatsapp className="text-green-600 text-lg" />
          <span className="text-sm font-medium">WhatsApp</span>
        </a>

        {/* Social group */}
        <div
          className="
            flex items-center gap-5 rounded-xl
            bg-white/80 backdrop-blur-md
            px-4 py-2 shadow-lg
          "
        >
          <a href="https://www.instagram.com/infinityenergy.xyz?utm_source=qr&igsh=dDhnM2didmh5NTRx" target="_blank" rel="noreferrer">
            <FaInstagram className="icon" />
          </a>
          <a href="https://www.facebook.com/people/Infinity-Energy/61586972440404/" target="_blank" rel="noreferrer">
            <FaFacebookF className="icon" />
          </a>
          <a href="https://www.linkedin.com/company/111389391/admin/page-posts/published/" target="_blank" rel="noreferrer">
            <FaLinkedinIn className="icon" />
          </a>
        </div>
      </div>

      {/* ===== CartPill mobile float — sits above dock, right side ===== */}
      <CartPill href="/store/quotation" cartCount={cartCount} visible={visible} variant="mobile" />

      <div
        className={`
          md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50
          transition-all duration-700 ease-out
          ${visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
          }
        `}
      >
        <div
          className="
            flex items-center justify-between gap-6
            px-7 py-4
            rounded-xl
            bg-white/55 backdrop-blur-xl
            border border-white/30
            shadow-[0_10px_30px_rgba(0,0,0,0.18)]
          "
        >
          {/* 📘 Catalog PDF */}
          <DockIcon href="/catalog.pdf">
            <FaBook />
          </DockIcon>

          <DockIcon href="/">
            <FaHome />
          </DockIcon>

          <DockIcon href="/contact">
            <FaEnvelope />
          </DockIcon>

          <DockIcon href="https://www.instagram.com/infinityenergy.xyz?utm_source=qr&igsh=dDhnM2didmh5NTRx">
            <FaInstagram />
          </DockIcon>

          <DockIcon href="https://www.facebook.com/people/Infinity-Energy/61586972440404/">
            <FaFacebookF />
          </DockIcon>

          <DockIcon href="https://wa.me/918866189016" pulse>
            <FaWhatsapp className="text-green-600" />
          </DockIcon>
        </div>
      </div>

      {/* ================= Desktop LEFT (Catalog pill) ================= */}
      <div
        className={`
          hidden md:flex fixed bottom-6 left-6 z-50
          transition-all duration-700 ease-out
          ${visible
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-12 pointer-events-none"
          }
        `}
      >
        <a
          href="/catalog.pdf"
          target="_blank"
          rel="noreferrer"
          className="
            flex items-center gap-2 rounded-xl
            bg-blue-600
             backdrop-blur-md
            px-4 py-2 shadow-lg
            hover:shadow-xl
            transition-all duration-300
            hover:-translate-y-1
          "
        >
          <FaBook className="text-white  text-lg" />
          <span className="text-sm text-white font-medium">Catalogue</span>
        </a>
      </div>

      {/* ================= Styles ================= */}
      <style>{`
        .icon {
          font-size: 1.1rem;
          transition: transform 0.25s ease;
        }
        .icon:hover {
          transform: scale(1.25);
        }

        /* iOS-like pulse (WhatsApp) */
        @keyframes wpPulse {
          0%   { transform: scale(1);    }
          50%  { transform: scale(1.15); }
          100% { transform: scale(1);    }
        }
        .wp-pulse {
          animation: wpPulse 1.6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}