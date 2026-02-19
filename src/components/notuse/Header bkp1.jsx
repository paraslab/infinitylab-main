import React, { useState, useRef, useEffect } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { HiMenuAlt3, HiX } from "react-icons/hi";


const productsLinks = [
  { label: "Product", href: "/productpage" },
  { label: "Environment Friendly", href: "/environment-friendly" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Group Company", href: "/group-company" },
  { label: "Quality at Laxriq", href: "/quality" },
  { label: "Global Presence", href: "/global-presence" },
];



export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full px-4">
      <nav
        ref={ref}
        className="relative mx-auto flex max-w-5xl items-center justify-between 
        rounded-full bg-white/80 border border-gray-200 
        px-5 py-3 text-black shadow-xl backdrop-blur-md"
      >
        {/* Logo */}
        <a
          href="/"
          className="font-bold text-lg tracking-wide hover:text-gray-700 transition"
        >
          Sol Studio
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <li>
            <a href="/" className="text-black">
              Home
            </a>
          </li>

          <li className="relative">

            <button
                onClick={() => {
                  setOpenMenu(openMenu === "products" ? null : "products");
                  // Redirect to your desired page
                  window.location.href = "/productpage"; 
                }}
                className="hover:text-black transition"
              >
                Products
              </button>

            {/* <button
              onClick={() =>
                setOpenMenu(openMenu === "products" ? null : "products")
              }
              className="hover:text-black transition"
            >
              Products
            </button> */}
            {/* {openMenu === "products" && (
              <Dropdown links={productsLinks} />
            )} */}
          </li>

          <li className="relative">

            <button
              onClick={() => {
                setOpenMenu(openMenu === "products" ? null : "products");
                // Redirect to your desired page
                window.location.href = "/blog"; 
              }}
              className="hover:text-black transition"
            >
              Blog
            </button>
            </li>

          <li className="relative">
            <button
              onClick={() =>
                setOpenMenu(openMenu === "company" ? null : "company")
              }
              className="hover:text-black transition"
            >
              Company
            </button>
            {openMenu === "company" && (
              <Dropdown links={companyLinks} />
            )}
          </li>
        </ul>

        {/* Desktop CTA */}
        <a
          href="/contact"
          className="hidden md:flex items-center gap-2 rounded-full 
          bg-gradient-to-r from-gray-800 to-gray-600 
          text-white px-5 py-2 text-sm font-medium 
          hover:opacity-90 transition"
        >
          Say hi <GoArrowUpRight />
        </a>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>

        {/* Mobile Menu */}
        <div
          className={`absolute left-0 top-full mt-3 w-full rounded-3xl 
          bg-white border border-gray-200 p-5 text-sm shadow-2xl 
          md:hidden transition-all duration-300 origin-top
          ${mobileOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
        >
          <div className="space-y-5">
            <a href="/" className="block font-medium text-black">
              Home
            </a>

            <MobileGroup
              title="Products"
              links={productsLinks}
              open={openMenu === "products"}
              onClick={() =>
                setOpenMenu(openMenu === "products" ? null : "products")
              }
            />

            <MobileGroup
              title="Company"
              links={companyLinks}
              open={openMenu === "company"}
              onClick={() =>
                setOpenMenu(openMenu === "company" ? null : "company")
              }
            />

            <a
              href="/contact"
              className="mt-3 inline-flex items-center gap-2 rounded-full 
              bg-gradient-to-r from-gray-800 to-gray-600 
              text-white px-5 py-2 font-medium"
            >
              Say hi <GoArrowUpRight />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

/* Desktop Dropdown */
function Dropdown({ links }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 mt-4 min-w-[230px] 
      rounded-2xl bg-white p-3 shadow-2xl 
      animate-in fade-in zoom-in duration-200"
    >
      <ul className="space-y-1">
        {links.map((lnk, i) => (
          <li key={i}>
            <a
              href={lnk.href}
              className="flex items-center justify-between rounded-lg 
              px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-black transition"
            >
              {lnk.label}
              <GoArrowUpRight className="text-gray-400" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Mobile Group */
function MobileGroup({ title, links, open, onClick }) {
  return (
    <div>
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between font-medium text-gray-800"
      >
        {title}
        <span className="text-lg">{open ? "−" : "+"}</span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 mt-3" : "max-h-0"
        }`}
      >
        <div className="ml-3 space-y-2">
          {links.map((lnk, i) => (
            <a
              key={i}
              href={lnk.href}
              className="block text-gray-600 hover:text-black transition"
            >
              {lnk.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
