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
import Pagination from "../../components/store/Pagination";
import { useCart } from "../../store/CartContext";
import storeApi from "../../api/axiosStore";

const PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 350;

const heroImage = "https://backend.infinityenergy.xyz/uploads/medicfa/producthero.webp";

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, lastPage: 1, perPage: PER_PAGE, currentPage: 1 });

  const gridRef = useRef(null);
  const catsLoaded = useRef(false);
  const navigate = useNavigate();
  const { items } = useCart();

  // Debounce search input → avoid hammering the API per keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeCat]);

  // Load categories once
  useEffect(() => {
    if (catsLoaded.current) return;
    catsLoaded.current = true;
    storeApi
      .get("/v1/store-categories")
      .then((res) => {
        setCategories(res.data?.data?.data || res.data?.data || res.data || []);
      })
      .catch((err) => console.error("Categories fetch failed", err));
  }, []);

  // Load paginated products whenever page/search/category changes
  useEffect(() => {
    const controller = new AbortController();

    const params = {
      page,
      per_page: PER_PAGE,
    };
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeCat !== "all") params.category_id = activeCat;

    setLoading(true);
    storeApi
      .get("/v1/store-products", { params, signal: controller.signal })
      .then((res) => {
        const payload = res.data?.data || {};
        const list = payload.data || [];
        setProducts(Array.isArray(list) ? list : []);
        setMeta({
          total: payload.total ?? list.length,
          lastPage: payload.last_page ?? 1,
          perPage: payload.per_page ?? PER_PAGE,
          currentPage: payload.current_page ?? page,
        });
      })
      .catch((err) => {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
        console.error("Store fetch failed", err);
        setProducts([]);
        setMeta({ total: 0, lastPage: 1, perPage: PER_PAGE, currentPage: 1 });
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [page, debouncedSearch, activeCat]);

  const handlePageChange = (next) => {
    setPage(next);
    if (gridRef.current) {
      const top = gridRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const rangeStart = meta.total === 0 ? 0 : (meta.currentPage - 1) * meta.perPage + 1;
  const rangeEnd = Math.min(meta.currentPage * meta.perPage, meta.total);

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
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                {meta.total === 0 ? "0 products" : `${rangeStart}–${rangeEnd} of ${meta.total}`}
              </span>
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
          <div ref={gridRef} className="scroll-mt-28">
            {loading ? (
              <LoadingSkeleton count={6} />
            ) : products.length === 0 ? (
              <EmptyState
                title="No products found"
                message={
                  debouncedSearch
                    ? `No results for "${debouncedSearch}"`
                    : "No products in this category yet."
                }
                action={debouncedSearch ? "Clear Search" : undefined}
                onAction={() => {
                  setSearch("");
                  setActiveCat("all");
                }}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <StoreProductCard key={product.id} product={product} />
                  ))}
                </div>

                <Pagination
                  page={meta.currentPage}
                  totalPages={meta.lastPage}
                  onChange={handlePageChange}
                  className="mt-10"
                />
              </>
            )}
          </div>
        </div>
      </main>

      <SocialFloating />
      <Footer />
    </>
  );
}
