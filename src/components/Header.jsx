import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { GoArrowUpRight } from "react-icons/go";
import { ShoppingCart } from "lucide-react";
import logo from "../assets/logo.png";
import { useCart } from "../store/CartContext";

/* ================= Solutions submenu ================= */
const solutionsLinks = [
  {
    title: "Island Mode",
    desc: "Standalone energy systems",
    path: "/solutions/island-mode",
  },
  {
    title: "Hybrid Mode",
    desc: "Grid + renewable integration",
    path: "/solutions/hybrid-mode",
  },
  {
    title: "Microgrid Mode",
    desc: "Smart localized grids",
    path: "/solutions/microgrid-mode",
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isStorePage = location.pathname.startsWith("/store");
  const cartCount = items.length;

  /* ================= Scroll animation ================= */
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 40) setScrolled(true);
      if (currentScrollY < lastScrollY) setScrolled(false);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuHover =
    "relative transition-all duration-300 hover:text-[#0A8B41] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0A8B41] after:transition-all after:duration-300 hover:after:w-full";

  const glassDropdown =
    "bg-white/70 backdrop-blur-xl border border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.15)]";

  return (
    <header
      className={`fixed left-1/2 -translate-x-1/2 z-50 w-full px-4 transition-all duration-500 ${
        scrolled ? "top-4" : "top-8"
      }`}
    >
      {/* ================= NAV ================= */}
      <nav
        className={`relative mx-auto flex items-center justify-between
        bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl
        transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          scrolled
            ? "max-w-[70%] px-3 py-1.5 rounded-2xl md:max-w-3xl"
            : "max-w-[96%] px-5 py-3 rounded-3xl md:max-w-5xl"
        }`}
      >
        {/* ================= Logo ================= */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Logo"
            className={`h-10 w-auto transition-transform duration-500 ${
              scrolled ? "scale-90" : "scale-100"
            }`}
          />
        </Link>

        {/* ================= Desktop Menu ================= */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
          <li><Link to="/" className={menuHover}>Home</Link></li>
          <li><Link to="/productpage" className={menuHover}>Products</Link></li>
          <li><Link to="/store" className={menuHover}>Store</Link></li>

          {/* ================= Solutions Dropdown ================= */}
          <li className="relative group">
            <span className={`${menuHover} cursor-pointer`}>
              Solutions
            </span>

            <div
              className={`
                absolute left-1/2 top-full mt-4 w-[340px]
                -translate-x-1/2 rounded-[28px]
                ${glassDropdown}
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-300
              `}
            >
              <div className="p-4 space-y-2">
                {solutionsLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="
                      block rounded-2xl p-4
                      transition-all duration-300
                      hover:bg-white/60
                      hover:-translate-y-1
                    "
                  >
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </li>

          <li><Link to="/blog" className={menuHover}>Blog</Link></li>
          <li><Link to="/Technology" className={menuHover}>Technology</Link></li>
          <li><Link to="/About" className={menuHover}>About</Link></li>
        </ul>

        {/* ================= Cart Pill ================= */}
        <div className="hidden md:flex items-center gap-3">
          {(isStorePage || cartCount > 0) && (
            <button
              onClick={() => navigate("/store/quotation")}
              className="relative flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:shadow-md"
            >
              <ShoppingCart size={15} />
              <span>Quote</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#2F8F6A] text-[10px] font-bold text-white shadow">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* ================= Desktop CTA ================= */}
          <Link
            to="/contact"
            className="flex items-center gap-2 rounded-2xl bg-[#2F8F6A] text-white px-5 py-2 text-sm font-medium transition-all hover:scale-105 hover:shadow-xl"
          >
            Say hi <GoArrowUpRight />
          </Link>
        </div>

        {/* ================= Mobile Toggle ================= */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </nav>

      {/* ================= Mobile Menu ================= */}
      <div
        className={`md:hidden mt-3 overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl p-6">
          <div className="flex flex-col gap-4 font-medium">
            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/productpage" onClick={() => setMobileOpen(false)}>Products</Link>
            <Link to="/store" onClick={() => setMobileOpen(false)}>Store</Link>

            {/* Mobile Solutions */}
            <button
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              className="flex justify-between"
            >
              Solutions <span>{solutionsOpen ? "−" : "+"}</span>
            </button>

            {solutionsOpen && (
              <div className="ml-4 space-y-2 text-sm">
                {solutionsLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      setMobileOpen(false);
                      setSolutionsOpen(false);
                    }}
                    className="block rounded-xl bg-white/70 px-4 py-3"
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-600">{item.desc}</div>
                  </Link>
                ))}
              </div>
            )}

            <Link to="/blog" onClick={() => setMobileOpen(false)}>Blog</Link>
            <Link to="/About" onClick={() => setMobileOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>

            {/* Mobile Cart */}
            {cartCount > 0 && (
              <button
                onClick={() => { setMobileOpen(false); navigate("/store/quotation"); }}
                className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700"
              >
                <ShoppingCart size={15} />
                Quote Cart
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#2F8F6A] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              </button>
            )}

            {/* Mobile CTA */}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F8F6A] text-white px-5 py-3"
            >
              Say hi <GoArrowUpRight />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
