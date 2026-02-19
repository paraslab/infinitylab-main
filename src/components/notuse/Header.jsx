import {useState, useEffect, useRef} from 'react'

export default function Header() {
  const [open, setOpen] = useState(false);       // mobile menu
    const [megaOpen, setMegaOpen] = useState(false); // full shutter
    const menuRef = useRef(null);
  
    useEffect(() => {
      function onResize() {
        if (window.innerWidth >= 768) setOpen(false);
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
        {/* Sticky pill header */}
        <header className="fixed top-10 z-50 w-full flex justify-center px-5">
          <div
            className="pointer-events-auto max-w-6xl w-full bg-white/90 backdrop-blur-md border border-gray-200
            rounded-full shadow-xl px-6 py-3 flex items-center gap-8"
          >
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 shrink-0">
              <svg
                className="w-10 h-10 rounded-full p-1 bg-gradient-to-br from-emerald-400 to-teal-500"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M4 12c0-4 4-8 8-8s8 4 8 8-4 8-8 8S4 16 4 12z" fill="white" />
              </svg>
              <span className="hidden md:inline text-lg font-semibold text-gray-900">
                Cetfar
              </span>
            </a>
  
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 mx-auto text-sm">
              <a href="#home" className="text-gray-600 hover:text-black">Home</a>
  
              {/* PRODUCTS — trigger mega shutter */}
              <button
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(true)}
                className="relative text-gray-600 hover:text-black"
              >
                Products
              </button>
  
              <a href="#about" className="text-gray-600 hover:text-black">About</a>
              <a href="#blog" className="text-gray-600 hover:text-black">Blog</a>
              <a href="#contact" className="text-gray-600 hover:text-black">Contact</a>
              <a href="#company" className="text-gray-600 hover:text-black">Over Company</a>
            </nav>
  
            {/* Button */}
            <a
              href="/get-started"
              className="hidden md:inline-flex items-center px-5 py-2 rounded-full bg-black text-white text-sm font-medium shadow-sm hover:brightness-95"
            >
              Get Started
            </a>
  
            {/* Mobile button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-gray-700"
            >
              {open ? "✖" : "☰"}
            </button>
          </div>
        </header>
  
        {/* 🔥 FULL-SIZE SHUTTER MEGA MENU */}
        <div
          onMouseEnter={() => setMegaOpen(true)}
          onMouseLeave={() => setMegaOpen(false)}
          className={`fixed left-0 right-0 top-24 z-40 bg-white shadow-2xl border-t 
            transition-all duration-500 overflow-hidden
            ${megaOpen ? "max-h-[430px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-4 gap-6">
  
            {[1,2,3,4].map((i)=>(
              <div
                key={i}
                className="h-72 bg-gray-100 rounded-2xl shadow-md overflow-hidden flex items-end p-5 relative
                  hover:scale-[1.02] transition-transform duration-300"
              >
                {/* placeholder background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
  
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold">Product {i}</h3>
                  <p className="text-gray-700 text-sm">Short product description</p>
                </div>
              </div>
            ))}
  
          </div>
        </div>
  
        {/* Mobile menu */}
        {open && (
          <div
            ref={menuRef}
            className="md:hidden fixed left-4 right-4 top-20 mx-4 bg-white border rounded-xl shadow-xl p-4 z-50"
          >
            <a className="block py-2" href="#home">Home</a>
            <a className="block py-2" href="#products">Products</a>
            <a className="block py-2" href="#about">About</a>
            <a className="block py-2" href="#blog">Blog</a>
            <a className="block py-2" href="#contact">Contact</a>
            <a className="block py-2" href="#company">Over Company</a>
            <a className="block mt-2 w-full py-2 text-center rounded-lg bg-black text-white" href="/get-started">
              Get Started
            </a>
          </div>
        )}
      </>
    );
}


