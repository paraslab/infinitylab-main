import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { GoArrowUpRight } from "react-icons/go";
import logo from "../assets/logo.png";
import { title } from "framer-motion/client";

/* Company submenu items */
const companyLinks = [
  {
    title: "About Us",
    desc: "Who we are & what we do",
    path: "/about",
  },
  {
    title: "Quality",
    desc: "Our standards & process",
    path: "/quality",
  },
  {
    title: "Global Presence",
    desc: "Worldwide operations",
    path: "/GlobalPresense",
  },
  {
    title:"GROUP COMPANIES",
    desc: "Worldwide operations",
    path: "/GroupofCompanies",
  }
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Scroll animation logic */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuHover =
    "relative transition-all duration-300 hover:text-[#0A8B41] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0A8B41] after:transition-all after:duration-300 hover:after:w-full";

  return (
    <header
      className={`
        fixed left-1/2 -translate-x-1/2 z-50 w-full px-4
        transition-all duration-500
        ${scrolled ? "top-4" : "top-8"}
      `}
    >
      {/* ================= NAV ================= */}
      <nav
        className={`
          relative mx-auto flex items-center justify-between
          bg-white/90 border border-gray-200 backdrop-blur-md shadow-xl
          transition-all duration-500 ease-out
          ${
            scrolled
              ? "max-w-3xl px-4 py-2 rounded-2xl"
              : "max-w-5xl px-5 py-3 rounded-3xl"
          }
        `}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="arteleaf"
            className={`
              h-8 w-auto transition-transform duration-500
              ${scrolled ? "scale-90" : "scale-100"}
            `}
          />
        </Link>

        {/* ================= Desktop Menu ================= */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
          <li>
            <Link to="/" className={menuHover}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/productpage" className={menuHover}>
              Products
            </Link>
          </li>
          <li>
            <Link to="/blog" className={menuHover}>
              Blog
            </Link>
          </li>

          {/* Company Dropdown */}
          <li className="relative group">
            <span className={`${menuHover} cursor-pointer`}>
              Company
            </span>

            <div
              className="
                absolute left-1/2 top-full mt-4 w-[320px]
                -translate-x-1/2 rounded-3xl bg-white shadow-2xl
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200
              "
            >
              <div className="p-4 space-y-2">
                {companyLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="
                      block rounded-2xl p-4
                      transition-all duration-300
                      hover:bg-gray-100
                      hover:-translate-y-1
                      hover:shadow-lg
                    "
                  >
                    <h4 className="font-semibold text-sm">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </li>

          <li>
            <Link to="/contact" className={menuHover}>
              Contact
            </Link>
          </li>
        </ul>

        {/* ================= Desktop CTA ================= */}
        <Link
          to="/contact"
          className="
            hidden md:flex items-center gap-2 rounded-2xl
            bg-[#0A8B41] text-white px-5 py-2 text-sm font-medium
            transition-all duration-300
            hover:bg-[#087636]
            hover:scale-105
            hover:shadow-xl
          "
        >
          Say hi <GoArrowUpRight />
        </Link>

        {/* ================= Mobile Toggle ================= */}
        <button
          className="md:hidden text-2xl active:scale-90 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </nav>

      {/* ================= Mobile Menu ================= */}
      <div
        className={`
          md:hidden mt-3 overflow-hidden transition-all duration-300
          ${mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="rounded-3xl bg-white shadow-2xl p-6">
          <div className="flex flex-col gap-4 text-base font-medium">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="transition hover:text-[#0A8B41] active:scale-95"
            >
              Home
            </Link>

            <Link
              to="/productpage"
              onClick={() => setMobileOpen(false)}
              className="transition hover:text-[#0A8B41] active:scale-95"
            >
              Products
            </Link>

            <Link
              to="/blog"
              onClick={() => setMobileOpen(false)}
              className="transition hover:text-[#0A8B41] active:scale-95"
            >
              Blog
            </Link>

            {/* Company Mobile Dropdown */}
            <button
              onClick={() => setCompanyOpen(!companyOpen)}
              className="flex items-center justify-between transition hover:text-[#0A8B41]"
            >
              Company <span>{companyOpen ? "−" : "+"}</span>
            </button>

            {companyOpen && (
              <div className="ml-4 space-y-2 text-sm">
                {companyLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      setMobileOpen(false);
                      setCompanyOpen(false);
                    }}
                    className="
                      block rounded-xl bg-gray-100 px-4 py-3
                      transition-all duration-200
                      hover:bg-gray-200
                      active:scale-95
                    "
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-500">
                      {item.desc}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="transition hover:text-[#0A8B41] active:scale-95"
            >
              Contact
            </Link>

            {/* Mobile CTA */}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="
                mt-2 inline-flex items-center justify-center gap-2
                rounded-2xl bg-[#0A8B41] text-white px-5 py-3 font-medium
                transition-all duration-300
                hover:bg-[#087636]
                hover:shadow-lg
                active:scale-95
              "
            >
              Say hi <GoArrowUpRight />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
