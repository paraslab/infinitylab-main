// ================== CORE ==================
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useEffect } from "react";

// ================== GLOBAL UTILITIES ==================
import ScrollToTop from "./components/ScrollToTop.jsx";
import ScrollReveal from "./components/ScrollReveal.jsx";
import RouteLoader from "./components/RouteLoader";

// ================== AUTH ==================
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// ================== ADMIN ==================
import Login from "./admin/Login.jsx";
import Loginhome from "./admin/Loginhome.jsx";

// ================== BILLING ==================
import BillingLogin from "./billing/BillingLogin.jsx";
import BillingLayout from "./billing/BillingLayout.jsx";
import BillingDashboard from "./billing/BillingDashboard.jsx";

// 👇 ADD THESE
import QuotationList from "./billing/quotation/QuotationList.jsx";
import QuotationCreate from "./billing/quotation/QuotationCreate.jsx";

// import QuotationForm from "./billing/pages/QuotationForm.jsx";


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

// ================== GOOGLE ANALYTICS ==================
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

// ================== MAIN APP CONTENT ==================
function AppContent() {
  const location = useLocation();

  // 👉 Treat admin + billing as non-public
  const isAdminRoute =
    location.pathname.startsWith("/loginhome") ||
    location.pathname === "/login" ||
    location.pathname.startsWith("/billing");


  // 👉 Load public CSS only for website
  useEffect(() => {
    if (!isAdminRoute) {
      import("./App.css");
    }
  }, [isAdminRoute]);

  // 👉 Disable copy protection in admin + billing
  useEffect(() => {
    if (isAdminRoute) return;

    const handleCopy = (e) => {
      const selection = window.getSelection();
      if (!selection || selection.toString().length === 0) return;

      e.preventDefault();

      toast("Protected By Infinity ✨", {
        icon: "🧊",
      });
    };

    document.addEventListener("copy", handleCopy);
    return () => document.removeEventListener("copy", handleCopy);
  }, [isAdminRoute]);

  return (
    <>
      <GoogleAnalyticsTracker />

      {/* Public Global UI */}
      {!isAdminRoute && (
        <>
          <Toaster position="top-center" />
          <ScrollReveal />
          <ScrollToTop />
        </>
      )}

      <RouteLoader>
        <Routes>
          {/* ================= PUBLIC ================= */}
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

          {/* ================= MAIN ADMIN ================= */}
          <Route path="/login" element={<Login />} />

          <Route
            path="/loginhome"
            element={
              <ProtectedRoute>
                <Loginhome />
              </ProtectedRoute>
            }
          />

          {/* ================= BILLING SYSTEM ================= */}

          {/* Billing Login */}
          <Route path="/billing" element={<BillingLogin />} />

          {/* Billing Protected Layout */}
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <BillingLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<BillingDashboard />} />

            <Route path="quotation">
              <Route index element={<QuotationList />} />
              <Route path="create" element={<QuotationCreate />} />
              <Route path="edit/:id" element={<QuotationCreate />} />
            </Route>

          </Route>



          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </RouteLoader>
    </>
  );
}

// ================== ROOT ==================
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
