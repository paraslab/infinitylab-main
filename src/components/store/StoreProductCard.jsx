import React, { useMemo, useState } from "react";
import { ArrowUpRight, Eye, ShoppingCart } from "lucide-react";
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
  const price = Number(product.price || 0);
  const gstPct = Number(product.gst_percent || 0);
  const priceWithGst = price + (price * gstPct) / 100;
  const categoryName = product.store_category?.name || product.category?.name || "Store Product";
  const productInfo = product.description || product.model || categoryName;

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

  const goToProduct = () => {
    navigate(`/store/product/${product.slug}`);
  };

  const priceLabel =
    price > 0
      ? `\u20B9${priceWithGst.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
      : "Price on request";

  const baseImageClasses = `h-full w-full object-cover transition-all duration-700 ease-out ${
    loaded ? "opacity-100" : "opacity-0"
  } ${isFallback ? "opacity-75" : ""}`;

  if (view === "list") {
    return (
      <div className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl sm:flex-row">
        <button
          type="button"
          onClick={goToProduct}
          className="relative h-56 flex-shrink-0 overflow-hidden bg-gray-50 text-left sm:h-auto sm:w-64"
          aria-label={`View ${product.name}`}
        >
          {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
          <img
            key={currentSrc}
            src={currentSrc}
            alt={product.name}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={handleError}
            className={`${baseImageClasses} group-hover:scale-110 group-hover:blur-[2px] group-hover:brightness-75`}
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#062D1D]/90 via-[#062D1D]/35 to-transparent p-4 text-white">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/70">
                {categoryName}
              </p>
              <h3 className="mt-1 line-clamp-2 text-base font-bold leading-tight text-white">
                {product.name}
              </h3>
            </div>
          </div>
        </button>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold leading-snug text-gray-900">
                {product.name}
              </h3>
              {product.model && (
                <p className="mb-2 text-xs text-gray-400">Model: {product.model}</p>
              )}
              {product.description && (
                <p className="line-clamp-3 text-sm text-gray-500">
                  {product.description}
                </p>
              )}
            </div>
            <div className="md:min-w-[180px] md:text-right">
              <p className="text-2xl font-bold text-gray-900">{priceLabel}</p>
              {price > 0 && (
                <p className="text-xs text-gray-400">
                  Incl. {gstPct}% GST
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:max-w-sm sm:flex-row">
            <button
              type="button"
              onClick={goToProduct}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#2F8F6A]/15 py-2.5 text-sm font-medium text-[#2F8F6A] transition-colors hover:bg-[#2F8F6A]/5"
            >
              <Eye size={15} />
              Details
            </button>
            <button
              type="button"
              onClick={handleAddToQuote}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#2F8F6A] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0A8B41]"
            >
              <ShoppingCart size={15} />
              Add to Quote
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <button
        type="button"
        onClick={goToProduct}
        className="group relative block aspect-square w-full overflow-hidden rounded-[28px] bg-[#F4FAF7] text-left shadow-sm ring-1 ring-[#2F8F6A]/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(6,45,29,0.18)] focus:outline-none focus:ring-2 focus:ring-[#2F8F6A]/35"
        aria-label={`View ${product.name}`}
      >
        {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
        <img
          key={currentSrc}
          src={currentSrc}
          alt={product.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`${baseImageClasses} group-hover:scale-110 group-hover:blur-[2px] group-hover:brightness-[0.72] group-focus-visible:scale-110 group-focus-visible:blur-[2px] group-focus-visible:brightness-[0.72]`}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_0%,rgba(255,255,255,0.24),transparent_34%),linear-gradient(180deg,rgba(6,45,29,0.10)_0%,rgba(6,45,29,0.05)_38%,rgba(6,45,29,0.88)_100%)] transition-opacity duration-500 group-hover:opacity-95" />

        <div className="absolute left-3 top-3 max-w-[calc(100%-5.5rem)] rounded-2xl bg-[#061D14]/78 px-3 py-2 text-white shadow-sm sm:left-4 sm:top-4">
          <h3 className={`line-clamp-2 font-semibold leading-tight text-white ${compact ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"}`}>
            {product.name}
          </h3>
        </div>

        {product.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-[#061D14]/78 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white sm:right-4 sm:top-4">
            Featured
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <div className="translate-y-1 rounded-[22px] bg-[#061D14]/82 p-3 text-white shadow-sm transition-all duration-500 group-hover:translate-y-0 group-hover:bg-[#061D14]/92 group-focus-visible:translate-y-0 group-focus-visible:bg-[#061D14]/92 sm:group-hover:p-4 sm:group-focus-visible:p-4">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="line-clamp-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/65">
                  {categoryName}
                </p>
                <p className={`mt-1 font-bold tracking-tight transition-all duration-500 group-hover:text-lg group-focus-visible:text-lg ${compact ? "text-sm" : "text-base sm:text-lg sm:group-hover:text-xl sm:group-focus-visible:text-xl"}`}>
                  {priceLabel}
                </p>
              </div>
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#0A8B41] transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={15} />
              </span>
            </div>

            <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] text-white/70">
              <span className="line-clamp-1">
                {price > 0 ? `Incl. ${gstPct}% GST` : "Request commercial quote"}
              </span>
              {!compact && (
                <span className="hidden max-w-[52%] truncate sm:block">
                  {product.model || categoryName}
                </span>
              )}
            </div>

            {!compact && (
              <p className="mt-0 max-h-0 overflow-hidden text-[10px] leading-4 text-white/76 opacity-0 transition-all duration-500 group-hover:mt-2 group-hover:max-h-12 group-hover:opacity-100 group-focus-visible:mt-2 group-focus-visible:max-h-12 group-focus-visible:opacity-100 sm:text-xs sm:leading-5">
                <span className="line-clamp-2">{productInfo}</span>
              </p>
            )}
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={handleAddToQuote}
        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-[#111714] px-4 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2F8F6A] hover:shadow-[0_18px_36px_rgba(47,143,106,0.24)] focus:outline-none focus:ring-2 focus:ring-[#2F8F6A]/35 sm:text-sm"
      >
        <ShoppingCart size={15} />
        {compact ? "Quote" : "Get Quote"}
      </button>
    </div>
  );
}
