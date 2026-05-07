import React, { useMemo, useState } from "react";
import { ShoppingCart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../store/CartContext";
import toast from "react-hot-toast";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://backend.infinityenergy.xyz";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>
      <rect width='400' height='400' fill='#f3f4f6'/>
      <g fill='#cbd5e1' transform='translate(200 200)'>
        <circle r='44' cy='-18'/>
        <path d='M-70 50 L-20 0 L20 30 L70 -10 L70 70 L-70 70 Z'/>
      </g>
      <text x='200' y='320' text-anchor='middle' font-family='system-ui,sans-serif' font-size='14' fill='#94a3b8' letter-spacing='2'>NO IMAGE</text>
    </svg>`
  );

function resolveImage(path) {
  if (!path || typeof path !== "string") return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) return trimmed;
  const cleaned = trimmed.replace(/^\/+/, "").replace(/^storage\//, "");
  return `${BACKEND}/storage/${cleaned}`;
}

function buildImageCandidates(product) {
  const cat = product?.store_category || product?.category || {};
  const sources = [product?.image_1, product?.image_2, product?.image_3, cat?.image];
  const seen = new Set();
  const urls = [];

  for (const src of sources) {
    const url = resolveImage(src);
    if (url && !seen.has(url)) {
      seen.add(url);
      urls.push(url);
    }
  }

  return urls;
}

export default function StoreProductCard({ product, view = "grid", compact = false }) {
  const candidates = useMemo(() => buildImageCandidates(product), [product]);
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const currentSrc = candidates[idx] || PLACEHOLDER;
  const isFallback = idx >= candidates.length;
  const price = parseFloat(product.price || 0);
  const gstPct = parseFloat(product.gst_percent || 0);
  const priceWithGst = price + (price * gstPct) / 100;
  const categoryName = product.store_category?.name || product.category?.name;
  const gridCardHeight = compact
    ? "h-[292px] sm:h-[312px] 2xl:h-[340px]"
    : "h-[340px] sm:h-[430px] xl:h-[468px]";

  const handleError = () => {
    setLoaded(false);
    if (idx < candidates.length) {
      setIdx((i) => i + 1);
    }
  };

  const handleAddToQuote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to quote`);
  };

  const imageBlock = (
    <div
      className={
        view === "list"
          ? "relative h-56 sm:h-auto sm:w-64 bg-gray-50 overflow-hidden flex-shrink-0"
          : compact
            ? "relative h-32 sm:h-36 2xl:h-40 bg-gray-50 overflow-hidden flex-shrink-0"
            : "relative h-32 sm:h-48 xl:h-56 bg-gray-50 overflow-hidden flex-shrink-0"
      }
    >
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
      <img
        key={currentSrc}
        src={currentSrc}
        alt={product.name}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-contain ${compact ? "p-3" : "p-3 sm:p-4"} transition-all duration-700 ease-out group-hover:scale-110 group-hover:blur-[2px] group-hover:brightness-75 group-focus-within:scale-110 group-focus-within:blur-[2px] group-focus-within:brightness-75 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${isFallback ? "opacity-70" : ""}`}
      />

      <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-[#062D1D]/88 via-[#062D1D]/28 to-transparent p-3 transition-all duration-500 ease-out group-hover:from-[#062D1D]/95 group-hover:via-[#062D1D]/55 group-focus-within:from-[#062D1D]/95 group-focus-within:via-[#062D1D]/55 sm:p-4">
        <div className="w-full translate-y-1 transition-all duration-500 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0">
          <div className="mb-2 inline-flex max-w-full rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/85 opacity-90 backdrop-blur-md ring-1 ring-white/20 transition-all duration-500 group-hover:bg-white/20 group-hover:opacity-100 group-focus-within:bg-white/20 group-focus-within:opacity-100">
            <span className="truncate">{categoryName || "Infinity Energy"}</span>
          </div>
          <h4 className={`font-bold leading-tight text-white drop-shadow-sm ${compact ? "line-clamp-2 text-xs sm:text-sm" : "line-clamp-2 text-sm sm:text-lg"}`}>
            {product.name}
          </h4>
          {!compact && (
            <p className="mt-1 hidden translate-y-2 text-xs text-white/75 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:line-clamp-1">
              {product.model ? `Model: ${product.model}` : "View details and add to quote"}
            </p>
          )}
        </div>
      </div>

      {/* Keep the small badge only for compact scanning; the main identity lives in the overlay. */}
      {categoryName && compact && (
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-600 px-2.5 py-1 rounded-full shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-0 group-focus-within:-translate-y-2 group-focus-within:opacity-0">
          {categoryName}
        </span>
      )}

      {product.featured && (
        <span className="absolute top-3 right-3 bg-amber-400 text-white text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-0 group-focus-within:-translate-y-2 group-focus-within:opacity-0">
          Featured
        </span>
      )}
    </div>
  );

  const priceBlock = price > 0 ? (
    <div
      className={
        view === "list"
          ? "min-h-[52px] md:text-right"
          : compact
            ? "mb-3 min-h-[38px]"
            : "mb-3 min-h-[46px] sm:mb-4"
      }
    >
      <div className={`flex items-baseline gap-2 ${view === "list" ? "md:justify-end" : ""}`}>
        <span
          className={
            view === "list"
              ? "text-2xl font-bold text-gray-900"
              : compact
                ? "text-base font-bold text-gray-900"
                : "text-base font-bold text-gray-900 sm:text-xl"
          }
        >
          &#8377;{priceWithGst.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </span>
        {!compact && <span className="hidden text-xs text-gray-400 sm:inline">incl. {gstPct}% GST</span>}
      </div>
      <p className={`text-xs text-gray-400 ${compact ? "leading-tight" : ""}`}>
        &#8377;{price.toLocaleString("en-IN", { maximumFractionDigits: 0 })} + GST
      </p>
    </div>
  ) : (
    <p
      className={
        view === "list"
          ? "min-h-[52px] text-sm text-gray-400 md:text-right"
          : compact
            ? "mb-3 min-h-[38px] text-xs text-gray-400"
            : "mb-3 min-h-[46px] text-sm text-gray-400 sm:mb-4"
      }
    >
      Price on request
    </p>
  );

  const actionBlock = (
    <div className={view === "list" ? "flex flex-col sm:flex-row gap-2 mt-5 sm:max-w-sm" : "flex gap-2"}>
      <button
        onClick={() => navigate(`/store/product/${product.slug}`)}
        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#2F8F6A]/15 text-sm font-medium text-[#2F8F6A] hover:bg-[#2F8F6A]/5 transition-colors ${
          compact ? "px-2 py-2" : "py-2.5"
        }`}
      >
        <Eye size={15} />
        {!compact && <span className="hidden sm:inline">Details</span>}
      </button>
      <button
        onClick={handleAddToQuote}
        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#2F8F6A] text-white text-sm font-medium hover:bg-[#0A8B41] transition-colors ${
          compact ? "px-2 py-2" : "py-2.5"
        }`}
      >
        <ShoppingCart size={15} />
        {!compact && <span className="hidden sm:inline">Add to Quote</span>}
      </button>
    </div>
  );

  if (view === "list") {
    return (
      <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row w-full">
        {imageBlock}
        <div className="flex flex-col flex-1 p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg leading-snug mb-1">
                {product.name}
              </h3>
              {product.model && (
                <p className="text-xs text-gray-400 mb-2">Model: {product.model}</p>
              )}
              {product.description && (
                <p className="text-sm text-gray-500 line-clamp-3">
                  {product.description}
                </p>
              )}
            </div>
            <div className="md:min-w-[180px]">{priceBlock}</div>
          </div>
          {actionBlock}
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative bg-white rounded-2xl border border-[#2F8F6A]/10 overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(47,143,106,0.16)] transition-all duration-300 flex w-full min-w-0 flex-col ${gridCardHeight}`}>
      {imageBlock}
      <div className={`flex min-h-0 flex-1 flex-col ${compact ? "p-3" : "p-3 sm:p-5"}`}>
        <h3 className={`font-semibold text-gray-900 leading-snug line-clamp-2 ${compact ? "min-h-[36px] text-sm" : "min-h-[40px] text-sm sm:text-base"}`}>
          {product.name}
        </h3>

        <p className={`text-xs text-gray-400 line-clamp-1 ${compact ? "mt-1 min-h-[16px]" : "mt-1 min-h-[18px] sm:mb-2"}`}>
          {product.model ? `Model: ${product.model}` : ""}
        </p>

        {!compact && (
          <p className="mb-3 mt-2 min-h-[38px] flex-1 text-xs sm:text-sm text-gray-500 line-clamp-2">
            {product.description || ""}
          </p>
        )}

        <div className="mt-auto flex-shrink-0">
          {priceBlock}
          {actionBlock}
        </div>
      </div>
    </div>
  );
}
