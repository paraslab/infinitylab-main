import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, SlidersHorizontal, List, RotateCcw, Filter, ShoppingBag } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SocialFloating from "../../components/SocialFloating";
import Seo from "../../components/Seo";
import HeroSinglePremium from "../../components/HeroSlider.jsx";
import StoreProductCard from "../../components/store/StoreProductCard";
import EmptyState from "../../components/store/EmptyState";
import Pagination from "../../components/store/Pagination";
import StoreLoader from "../../components/store/StoreLoader";
import { useCart } from "../../store/CartContext";
import storeApi from "../../api/axiosStore";

const PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 350;

const heroImage = "https://backend.infinityenergy.xyz/uploads/media/producthero.webp";

function GridIcon({ columns }) {
  return (
    <span
      className="grid gap-[2px]"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      aria-hidden="true"
    >
      {Array.from({ length: columns }).map((_, index) => (
        <span key={index} className="h-3 w-2 rounded-[2px] bg-current" />
      ))}
    </span>
  );
}

const VIEW_OPTIONS = [
  { value: "grid3", label: "3", columns: 3 },
  { value: "grid4", label: "4", columns: 4 },
  // { value: "grid6", label: "6", columns: 6 },
  { value: "list", label: "List", icon: List },
];

function FilterSidebar({
  categories,
  activeCat,
  setActiveCat,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  resetFilters,
  onClose,
  closeOnSelect = false,
  className = "",
}) {
  const handleCategorySelect = (categoryId) => {
    setActiveCat(categoryId);
    if (closeOnSelect && onClose) onClose();
  };

  return (
    <aside
      className={`bg-white border border-[#2F8F6A]/10 rounded-[32px] shadow-[0_24px_80px_rgba(47,143,106,0.16)] p-4 ${className}`}
    >
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2F8F6A] via-[#167C4B] to-[#075A32] p-5 text-white shadow-[0_18px_45px_rgba(47,143,106,0.28)]">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-lime-300/10" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/70 font-semibold">Filters</p>
            <h2 className="mt-1 text-xl font-bold leading-tight">Shop Categories</h2>
            <p className="mt-2 text-xs leading-relaxed text-white/75">
              Find the right product faster with focused controls.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-xs font-medium text-white backdrop-blur hover:bg-white/25"
            >
              <RotateCcw size={13} />
              Reset
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25 transition-colors"
                aria-label="Close filters"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => handleCategorySelect("all")}
          className={`min-h-[74px] w-full rounded-2xl px-3 py-3 text-left text-sm font-semibold transition-all ${
            activeCat === "all"
              ? "bg-[#2F8F6A] text-white shadow-lg shadow-[#2F8F6A]/25 ring-1 ring-[#2F8F6A]"
              : "bg-gradient-to-br from-[#2F8F6A]/8 to-white text-gray-800 ring-1 ring-[#2F8F6A]/10 hover:-translate-y-0.5 hover:bg-[#2F8F6A]/10 hover:text-[#0A8B41] hover:shadow-md"
          }`}
        >
          <span className="block text-xs uppercase tracking-[0.16em] opacity-70">View</span>
          <span className="mt-1 block leading-tight">All Products</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategorySelect(cat.id)}
            className={`min-h-[74px] w-full rounded-2xl px-3 py-3 text-left text-sm font-semibold transition-all ${
              activeCat === cat.id
                ? "bg-[#2F8F6A] text-white shadow-lg shadow-[#2F8F6A]/25 ring-1 ring-[#2F8F6A]"
                : "bg-gradient-to-br from-[#2F8F6A]/8 to-white text-gray-800 ring-1 ring-[#2F8F6A]/10 hover:-translate-y-0.5 hover:bg-[#2F8F6A]/10 hover:text-[#0A8B41] hover:shadow-md"
            }`}
          >
            <span className="block text-xs uppercase tracking-[0.16em] opacity-70">Category</span>
            <span className="mt-1 line-clamp-2 block leading-tight">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[26px] border border-[#2F8F6A]/10 bg-[#F7FCF9] p-4">
        <label className="block text-sm font-semibold text-gray-900 mb-3">Price Range</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full px-3 py-2.5 rounded-xl border border-[#2F8F6A]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8F6A]/20 focus:border-[#2F8F6A]"
          />
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full px-3 py-2.5 rounded-xl border border-[#2F8F6A]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8F6A]/20 focus:border-[#2F8F6A]"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">Filters the products currently shown.</p>
      </div>

      <div className="mt-4 rounded-[26px] border border-[#2F8F6A]/10 bg-[#F7FCF9] p-4">
        <label className="block text-sm font-semibold text-gray-900 mb-3">Sort Products</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-[#2F8F6A]/15 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2F8F6A]/20 focus:border-[#2F8F6A]"
        >
          <option value="default">Default</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>
    </aside>
  );
}

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, lastPage: 1, perPage: PER_PAGE, currentPage: 1 });
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid3");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const gridRef = useRef(null);
  const catsLoaded = useRef(false);
  const { items } = useCart();

  useEffect(() => {
    if (!showMobileFilters) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showMobileFilters]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeCat]);

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

  const visibleProducts = useMemo(() => {
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    const filtered = products.filter((product) => {
      const price = Number(product.price || 0);
      if (min !== null && price < min) return false;
      if (max !== null && price > max) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "name_asc") return String(a.name || "").localeCompare(String(b.name || ""));
      if (sortBy === "price_low") return Number(a.price || 0) - Number(b.price || 0);
      if (sortBy === "price_high") return Number(b.price || 0) - Number(a.price || 0);
      return 0;
    });
  }, [products, minPrice, maxPrice, sortBy]);

  const handlePageChange = (next) => {
    setPage(next);
    if (gridRef.current) {
      const top = gridRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setActiveCat("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
    setPage(1);
  };

  const activeFiltersCount = [
    activeCat !== "all",
    Boolean(debouncedSearch),
    Boolean(minPrice),
    Boolean(maxPrice),
    sortBy !== "default",
  ].filter(Boolean).length;

  const cartQty = items.reduce((sum, item) => sum + item.qty, 0);
  const rangeStart = meta.total === 0 ? 0 : (meta.currentPage - 1) * meta.perPage + 1;
  const rangeEnd = Math.min(meta.currentPage * meta.perPage, meta.total);

  return (
    <>
      <Seo
        title="Store | Infinity Energy"
        description="Browse Infinity Energy products. Add items to your quotation."
      />
      <Header />

      <main className="pt-0 space-y-8">
        <HeroSinglePremium
          image={heroImage}
          title="Our Store"
          subtitle="Explore our full range of energy solutions."
        />

        <div className="mx-auto max-w-[1480px] px-3 sm:px-4 lg:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-5 xl:gap-6 items-start">
            <div className="hidden lg:sticky lg:top-[112px] lg:block lg:h-[calc(100vh-128px)] lg:self-start">
              <FilterSidebar
                categories={categories}
                activeCat={activeCat}
                setActiveCat={setActiveCat}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                sortBy={sortBy}
                setSortBy={setSortBy}
                resetFilters={resetFilters}
                className="no-scrollbar h-full max-h-full overflow-y-auto overscroll-contain"
              />
            </div>

            <section className="min-w-0">
              <div className="bg-white border border-[#2F8F6A]/10 rounded-3xl shadow-[0_18px_60px_rgba(47,143,106,0.10)] p-4 md:p-5 mb-6">
                <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#2F8F6A]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8F6A]/20 focus:border-[#2F8F6A] bg-white"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Clear search"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 justify-between xl:justify-end">
                    <button
                      type="button"
                      onClick={() => setShowMobileFilters((value) => !value)}
                      className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2F8F6A]/15 text-sm font-medium text-[#2F8F6A] bg-[#2F8F6A]/5"
                    >
                      <Filter size={15} />
                      Filters
                      {activeFiltersCount > 0 && (
                        <span className="bg-[#2F8F6A] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          {activeFiltersCount}
                        </span>
                      )}
                    </button>

                    <div className="inline-flex items-center rounded-xl border border-[#2F8F6A]/15 bg-[#2F8F6A]/5 p-1">
                      {VIEW_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isActive = viewMode === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setViewMode(option.value)}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                              isActive
                                ? "bg-[#2F8F6A] text-white shadow-sm shadow-[#2F8F6A]/25"
                                : "text-[#2F8F6A] hover:bg-white"
                            }`}
                            aria-label={`${option.label} product view`}
                          >
                            {Icon ? <Icon size={15} /> : <GridIcon columns={option.columns} />}
                            <span>{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-[#2F8F6A]/10">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <SlidersHorizontal size={16} className="text-gray-400" />
                    <span>
                      {meta.total === 0 ? "0 products" : `${rangeStart}-${rangeEnd} of ${meta.total}`}
                    </span>
                    {visibleProducts.length !== products.length && (
                      <span className="text-gray-400">({visibleProducts.length} after filters)</span>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <ShoppingBag size={16} className="text-gray-400" />
                    <span>{cartQty} item{cartQty === 1 ? "" : "s"} in quote</span>
                  </div>
                </div>
              </div>

              <div ref={gridRef} className="scroll-mt-28">
                {loading ? (
                  <StoreLoader />
                ) : visibleProducts.length === 0 ? (
                  <EmptyState
                    title="No products found"
                    message={
                      debouncedSearch
                        ? `No results for "${debouncedSearch}"`
                        : "No products match the selected filters."
                    }
                    action="Clear Filters"
                    onAction={resetFilters}
                  />
                ) : (
                  <>
                    <div
                      className={
                        viewMode === "list"
                          ? "flex flex-col gap-5"
                          : viewMode === "grid6"
                            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-4 auto-rows-fr items-stretch"
                            : viewMode === "grid4"
                              ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 xl:gap-5 auto-rows-fr items-stretch"
                              : "grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 xl:gap-6 auto-rows-fr items-stretch"
                      }
                    >
                      {visibleProducts.map((product) => (
                        <StoreProductCard
                          key={product.id}
                          product={product}
                          view={viewMode === "list" ? "list" : "grid"}
                          compact={viewMode === "grid6"}
                        />
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
            </section>
          </div>
        </div>

        {showMobileFilters && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
              onClick={() => setShowMobileFilters(false)}
              aria-label="Close filters overlay"
            />
            <div className="relative h-full w-[88vw] max-w-[360px]">
              <FilterSidebar
                categories={categories}
                activeCat={activeCat}
                setActiveCat={setActiveCat}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                sortBy={sortBy}
                setSortBy={setSortBy}
                resetFilters={resetFilters}
                onClose={() => setShowMobileFilters(false)}
                closeOnSelect
                className="no-scrollbar h-full max-h-screen overflow-y-auto overscroll-contain rounded-none rounded-r-[28px]"
              />
            </div>
          </div>
        )}
      </main>

      <SocialFloating />
      <Footer />
    </>
  );
}
