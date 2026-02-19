// ================== CORE ==================
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useEffect } from "react";
import "./App.css";

// ================== GLOBAL UTILITIES ==================
import ScrollToTop from "./components/ScrollToTop.jsx";
import ScrollReveal from "./components/ScrollReveal.jsx";
// import SmoothCursor from "./components/SmoothCursor"
import RouteLoader from "./components/RouteLoader.jsx";

// ================== AUTH ==================
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// ================== ADMIN ==================
import Login from "./admin/Login.jsx";
import Loginhome from "./admin/Loginhome.jsx";

// ================== PAGES ==================
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Blog from "./pages/Blog.jsx";
import BlogSingle from "./pages/BlogSingle.jsx";
import Contact from "./pages/Contact.jsx";
import ProductSingle from "./pages/ProductSingle.jsx";
import Productpage from "./pages/Productpage.jsx";
import IslandMode from "./pages/IslandMode.jsx";
import HybridMode from "./pages/HybridMode.jsx";
import MicrogridMode from "./pages/MicrogridMode.jsx";
import Technology from "./pages/Technology.jsx";

// ================== GOOGLE ANALYTICS TRACKER ==================
function GoogleAnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-7LM14RRX6G", {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
}

// ================== APP ==================
function App() {
  // ================== COPY PROTECTION EFFECT ==================
  useEffect(() => {
    const handleCopy = (e) => {
      const selection = window.getSelection();
      if (!selection || selection.toString().length === 0) return;

      e.preventDefault();

      const range = selection.getRangeAt(0);
      const el =
        range.commonAncestorContainer.nodeType === 1
          ? range.commonAncestorContainer
          : range.commonAncestorContainer.parentElement;

      if (!el) return;

      el.classList.add("glass-copy");

      setTimeout(() => {
        el.classList.remove("glass-copy");
      }, 600);

      toast("Protected By Infinity ✨", {
        icon: "🧊",
      });
    };

    document.addEventListener("copy", handleCopy);
    return () => document.removeEventListener("copy", handleCopy);
  }, []);

  return (
    <Router>
      {/* ✅ Google Analytics SPA Tracking */}
      <GoogleAnalyticsTracker />

      {/* ---------- Global UI ---------- */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(30, 30, 30, 0.33)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            borderRadius: "20px",
            padding: "14px 40px",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 500,
          },
        }}
      />

      <ScrollReveal />
      <ScrollToTop />
      {/* <SmoothCursor /> */}

      {/* ---------- Routes ---------- */}
      <RouteLoader>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/Technology" element={<Technology />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog/:slug" element={<BlogSingle />} />
          <Route path="/productpage" element={<Productpage />} />
          <Route path="/shop/:slug" element={<ProductSingle />} />
          <Route path="/solutions/island-mode" element={<IslandMode />} />
          <Route path="/solutions/hybrid-mode" element={<HybridMode />} />
          <Route path="/solutions/microgrid-mode" element={<MicrogridMode />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* 🔐 Protected Admin */}
          <Route
            path="/loginhome"
            element={
              <ProtectedRoute>
                <Loginhome />
              </ProtectedRoute>
            }
          />
        </Routes>
      </RouteLoader>
    </Router>
  );
}

export default App;
