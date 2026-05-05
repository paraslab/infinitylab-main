import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, SlidersHorizontal } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SocialFloating from "../../components/SocialFloating";
import Seo from "../../components/Seo";
import HeroSinglePremium from "../../components/HeroSlider.jsx";
import StoreProductCard from "../../components/store/StoreProductCard";
import LoadingSkeleton from "../../components/store/LoadingSkeleton";
import EmptyState from "../../components/store/EmptyState";
import { useCart } from "../../store/CartContext";
import storeApi from "../../api/axiosStore";

const heroImage = "https://backend.infinityenergy.xyz/uploads/medicfa/producthero.webp";

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const hasFetched = useRef(false);
  const navigate = useNavigate();
  const { items } = useCart();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const load = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          storeApi.get("/v1/store-products"),
          storeApi.get("/v1/store-categories"),
        ]);
        setProducts(
          prodRes.data?.data?.data || prodRes.data?.data || prodRes.data || []
        );
        setCategories(
          catRes.data?.data?.data || catRes.data?.data || catRes.data || []
        );
      } catch (err) {
        console.error("Store fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = products.filter((p) => {
    const matchCat =
      activeCat === "all" ||
      p.store_category?.id === activeCat ||
      p.category?.id === activeCat ||
      p.store_category_id === activeCat;
    const matchSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.model?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Seo
        title="Store | Infinity Energy"
        description="Browse Infinity Energy products. Add items to your quotation."
      />
      <Header />

      <main className="pt-0 px-4 md:px-4 space-y-8">
        <HeroSinglePremium
          image={heroImage}
          title="Our Store"
          subtitle="Explore our full range of energy solutions."
        />

<div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          {/* Search + Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">{filtered.length} products</span>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCat("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCat === "all"
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCat === cat.id
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products grid */}
          {loading ? (
            <LoadingSkeleton count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No products found"
              message={search ? `No results for "${search}"` : "No products in this category yet."}
              action={search ? "Clear Search" : undefined}
              onAction={() => { setSearch(""); setActiveCat("all"); }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <StoreProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <SocialFloating />
      <Footer />
    </>
  );
}
