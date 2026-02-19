// ================== CORE ==================
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import './App.css';

// ================== GLOBAL UTILITIES ==================
import ScrollToTop from "./components/ScrollToTop.jsx";
import ScrollReveal from "./components/ScrollReveal.jsx";
import SmoothCursor from "./components/SmoothCursor"

// ================== AUTH ==================
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// ================== ADMIN ==================
import Login from './admin/Login.jsx';
import Loginhome from './admin/Loginhome.jsx';

// ================== PAGES ==================
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Blog from './pages/Blog.jsx';
import Quality from "./pages/Quality.jsx";
import BlogSingle from "./pages/BlogSingle.jsx";
import Contact from './pages/Contact.jsx';
import ProductSingle from "./pages/ProductSingle.jsx";
import Productpage from "./pages/Productpage.jsx";
import GroupofCompanies from "./pages/GroupCompany.jsx"
import GlobalPresense from "./pages/GlobalPresense.jsx"
// import Catalogue from "./pages/Catalogue.jsx"



function App() {
  return (
    <Router>
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
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.15)",
            borderRadius: "20px",
            padding: "14px 20px",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 500,
          },
        }}
      />
      <ScrollReveal />
      <ScrollToTop />
      <SmoothCursor />


      {/* ---------- Routes ---------- */}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/quality" element={<Quality />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog/:slug" element={<BlogSingle />} />
        <Route path="/productpage" element={<Productpage />} />
        <Route path="/shop/:slug" element={<ProductSingle />} />
        <Route path="/GroupofCompanies" element={<GroupofCompanies />} />
        <Route path="/GlobalPresense" element={<GlobalPresense />} />
        {/* <Route path="/Catalogue" element={<Catalogue />} /> */}


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
    </Router>
  );
}

export default App;
