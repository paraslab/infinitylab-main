import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [open, setOpen] = useState(false); // mobile menu
  const [productOpen, setProductOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  const menuRef = useRef(null);
  const productRef = useRef(null);
  const companyRef = useRef(null);

  // Close mobile menu on resize
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function onDoc(e) {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (
        productOpen &&
        productRef.current &&
        !productRef.current.contains(e.target)
      ) {
        setProductOpen(false);
      }
      if (
        companyOpen &&
        companyRef.current &&
        !companyRef.current.contains(e.target)
      ) {
        setCompanyOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, productOpen, companyOpen]);

  return (
    <>
      {/* Header */}
      <header className="fixed top-10 z-50 w-full flex justify-center px-5">
        <div
          className="pointer-events-auto max-w-6xl w-full bg-white/90 backdrop-blur-md border border-gray-200
          rounded-full shadow-xl px-6 py-3 flex items-center"
        >
          {/* Left: Logo */}
          <a href="/" className="flex items-center gap-3 shrink-0">
            <svg
              className="w-10 h-10 rounded-full p-1 bg-gradient-to-br from-emerald-400 to-teal-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M4 12c0-4 4-8 8-8s8 4 8 8-4 8-8 8S4 16 4 12z"
                fill="white"
              />
            </svg>
            <span className="hidden md:inline text-lg font-semibold text-gray-900">
              Cetfar
            </span>
          </a>

          {/* Center: Nav */}
          <nav className="hidden md:flex items-center gap-8 mx-auto text-sm">
            <a href="#home" className="text-gray-600 hover:text-black">
              Home
            </a>

            {/* Products */}
            <div ref={productRef} className="relative">
              <button
                onClick={() => {
                  setProductOpen(!productOpen);
                  setCompanyOpen(false);
                }}
                className="text-gray-600 hover:text-black"
              >
                Products
              </button>

              {productOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-white border rounded-xl shadow-xl p-3 z-50">
                  <a href="#p1" className="block px-3 py-2 rounded-lg hover:bg-gray-100">
                    Product 1
                  </a>
                  <a href="#p2" className="block px-3 py-2 rounded-lg hover:bg-gray-100">
                    Product 2
                  </a>
                  <a href="#p3" className="block px-3 py-2 rounded-lg hover:bg-gray-100">
                    Product 3
                  </a>
                </div>
              )}
            </div>

            <a href="#blog" className="text-gray-600 hover:text-black">
              Blog
            </a>

            <a href="#contact" className="text-gray-600 hover:text-black">
              Contact
            </a>

            {/* Company */}
            <div ref={companyRef} className="relative">
              <button
                onClick={() => {
                  setCompanyOpen(!companyOpen);
                  setProductOpen(false);
                }}
                className="text-gray-600 hover:text-black"
              >
                Company
              </button>

              {companyOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white border rounded-xl shadow-xl p-3 z-50">
                  <a href="#about" className="block px-3 py-2 rounded-lg hover:bg-gray-100">
                    About Us
                  </a>
                  <a href="#group" className="block px-3 py-2 rounded-lg hover:bg-gray-100">
                    Group Company
                  </a>
                  <a href="#quality" className="block px-3 py-2 rounded-lg hover:bg-gray-100">
                    Quality at Laxriq
                  </a>
                  <a href="#global" className="block px-3 py-2 rounded-lg hover:bg-gray-100">
                    Global Presence
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Social + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" className="text-gray-600 hover:text-black">
              📸
            </a>
            <a href="https://facebook.com" target="_blank" className="text-gray-600 hover:text-black">
              📘
            </a>
    
          </div>

          {/* Mobile toggle */}
      
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div
          ref={menuRef}
          className="md:hidden fixed left-4 right-4 top-20 bg-white border rounded-xl shadow-xl p-4 z-50"
        >
          <a className="block py-2" href="#home">Home</a>
          <a className="block py-2" href="#products">Products</a>
          <a className="block py-2" href="#blog">Blog</a>
          <a className="block py-2" href="#contact">Contact</a>
          <a className="block py-2" href="#company">Company</a>

          <div className="flex gap-4 mt-3">
            <a href="https://instagram.com">📸</a>
            <a href="https://facebook.com">📘</a>
          </div>

          <a
            className="block mt-3 w-full py-2 text-center rounded-lg bg-black text-white"
            href="/get-started"
          >
            Get Started
          </a>
        </div>
      )}
    </>
  );
}
