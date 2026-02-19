import React, { useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
// import "../style/CardNavSimple.css";

/* MENU DATA */
const items = [
  {
    label: "Main",
    bgColor: "#f8fafc",
    textColor: "#0f172a",
    links: [
      { label: "Home", href: "/" },
      { label: "Catalogue", href: "/catalogue" },
      { label: "Blog", href: "/blog" }
    ]
  },
  {
    label: "Products",
    bgColor: "#fff7ed",
    textColor: "#7a4b00",
    links: [
      { label: "Product", href: "/product" },
      { label: "Environment Friendly", href: "/environment-friendly" }
    ]
  },
  {
    label: "Company",
    bgColor: "#eef2ff",
    textColor: "#2432a8",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Group Company", href: "/group-company" },
      { label: "Quality at Laxriq", href: "/quality" },
      { label: "Global Presence", href: "/global-presence" }
    ]
  },
  {
    label: "Support",
    bgColor: "#eefbf6",
    textColor: "#0b6a52",
    links: [{ label: "Contact Us", href: "/contact" }]
  }
];

export default function CardNavSimple({
  logo,
  baseColor = "#ffffff",
  menuColor = "#111"
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="cns-container">
      <nav
        className={`cns-nav ${open ? "open" : ""}`}
        style={{ background: baseColor, color: menuColor }}
      >
        {/* TOP BAR */}
        <div className="cns-top">
          {/* LEFT: Hamburger */}
          <button
            className={`cns-hamburger ${open ? "is-open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            <span />
            <span />
          </button>

          {/* RIGHT: Logo */}
          {logo && (
            <div className="cns-logo">
              <img src={logo} alt="Logo" />
            </div>
          )}
        </div>

        {/* MENU */}
        <div className="cns-content">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="cns-card"
              style={{ background: item.bgColor, color: item.textColor }}
            >
              <div className="cns-card-title">{item.label}</div>

              <div className="cns-links">
                {item.links.map((lnk, i) => (
                  <a key={i} href={lnk.href} className="cns-link">
                    <GoArrowUpRight />
                    <span>{lnk.label}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
