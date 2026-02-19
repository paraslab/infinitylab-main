import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      } else {
        setMegaOpen(false);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    function onDoc(e) {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <>
      {/* Header */}
      <header className="fixed top-5 md:top-8  z-50 w-full flex justify-center px-4">
        <div className="pointer-events-auto max-w-6xl w-full bg-white/90 backdrop-blur-md border border-gray-200
          rounded-full shadow-xl px-5 py-3 flex items-center gap-6">
          
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
            <span className="hidden sm:inline text-base font-semibold text-gray-900">
              Cetfar
            </span>
          </a>

          {/* Desktop Nav (lg+) */}
          <nav className="hidden lg:flex items-center gap-8 mx-auto text-sm">
            <a href="#home" className="text-gray-600 hover:text-black">Home</a>

            <button
              onMouseEnter={() => setMegaOpen(true)}
              className="text-gray-600 hover:text-black"
            >
              Products
            </button>

            <a href="#about" className="text-gray-600 hover:text-black">About</a>
            <a href="#blog" className="text-gray-600 hover:text-black">Blog</a>
            <a href="#contact" className="text-gray-600 hover:text-black">Contact</a>
            <a href="#company" className="text-gray-600 hover:text-black">Our Company</a>
          </nav>

          {/* Desktop Button */}
          <a
            href="/get-started"
            className="hidden lg:inline-flex items-center px-5 py-2 rounded-full bg-black text-white text-sm font-medium"
          >
            Get Started
          </a>

          {/* Mobile / Tablet Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden ml-auto p-2 text-gray-700"
          >
            {open ? "✖" : "☰"}
          </button>
        </div>
      </header>

      {/* Mega Menu (only lg+) */}
      <div
        onMouseEnter={() => setMegaOpen(true)}
        onMouseLeave={() => setMegaOpen(false)}
        className={`hidden lg:block fixed left-0 right-0 top-24 z-40 bg-white shadow-2xl border-t
        transition-all duration-500 overflow-hidden
        ${megaOpen ? "max-h-[430px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-4 gap-6">
          {[1,2,3,4].map((i)=>(
            <div key={i} className="h-72 bg-gray-100 rounded-2xl shadow-md p-5 flex items-end">
              <div>
                <h3 className="text-xl font-semibold">Product {i}</h3>
                <p className="text-gray-700 text-sm">Short product description</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile / Tablet Menu */}
      {open && (
        <div
          ref={menuRef}
          className="lg:hidden fixed left-4 right-4 top-20 bg-white border rounded-2xl shadow-xl p-5 z-50 space-y-3"
        >
          {["Home","Products","About","Blog","Contact","Our Company"].map((item)=>(
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "")}`}
              className="block py-2 text-gray-700 font-medium"
            >
              {item}
            </a>
          ))}

          <a
            className="block mt-2 w-full py-3 text-center rounded-xl bg-black text-white font-medium"
            href="/get-started"
          >
            Get Started
          </a>
        </div>
      )}
    </>
  );
}
