import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronRight, FileText, ShoppingCart, Zap } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Seo from "../../components/Seo";
import LoadingSkeleton from "../../components/store/LoadingSkeleton";
import EmptyState from "../../components/store/EmptyState";
import toast from "react-hot-toast";
import storeApi from "../../api/axiosStore";
import { useCart } from "../../store/CartContext";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://backend.infinityenergy.xyz";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 420'>
      <rect width='600' height='420' fill='#f3f4f6'/>
      <g fill='#cbd5e1' transform='translate(300 200)'>
        <circle r='48' cy='-24'/>
        <path d='M-90 70 L-28 0 L18 36 L90 -18 L90 88 L-90 88 Z'/>
      </g>
      <text x='300' y='350' text-anchor='middle' font-family='system-ui,sans-serif' font-size='16' fill='#94a3b8' letter-spacing='2'>NO IMAGE</text>
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

function buildImages(product) {
  const urls = [product?.image_1, product?.image_2, product?.image_3]
    .map(resolveImage)
    .filter(Boolean);

  return urls.length ? urls : [PLACEHOLDER];
}

const fmt = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function StoreProductSingle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(PLACEHOLDER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    storeApi
      .get(`/v1/store-products/${slug}`, { signal: controller.signal })
      .then((res) => {
        const data = res.data?.data || res.data;
        setProduct(data);
        setActiveImg(buildImages(data)[0]);
      })
      .catch((err) => {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
        console.error("Store product fetch failed", err);
        setProduct(null);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [slug]);

  const images = useMemo(() => buildImages(product), [product]);
  const categoryName = product?.store_category?.name || product?.category?.name || "Store Product";
  const price = Number(product?.price || 0);
  const gstPct = Number(product?.gst_percent || 0);
  const priceWithGst = price + (price * gstPct) / 100;
  const inQuote = product ? items.some((item) => item.product.id === product.id) : false;

  const productFacts = [
    { label: "Model", value: product?.model, icon: FileText },
    { label: "VA", value: product?.va, icon: Zap },
    { label: "Voltage", value: product?.voltage, icon: Zap },
    { label: "GST", value: product?.gst_percent ? `${product.gst_percent}%` : null, icon: CheckCircle2 },
  ].filter((item) => item.value !== null && item.value !== undefined && String(item.value).trim() !== "");

  const handleAddToQuote = () => {
    if (!product) return;
    addItem(product);
    toast.success(`${product.name} added to quote`);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#F7FCF9] px-4 pt-36 pb-16">
          <div className="mx-auto max-w-6xl">
            <LoadingSkeleton count={3} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#F7FCF9] px-4 pt-36 pb-16">
          <EmptyState
            title="Store product not found"
            message="This product may be unavailable or moved."
            action="Back to Store"
            onAction={() => navigate("/store")}
          />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Seo
        title={`${product.name} | Infinity Energy Store`}
        description={product.description || `View ${product.name} in the Infinity Energy store.`}
      />
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-[#F7FCF9] via-white to-white px-3 pt-32 pb-16 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={() => navigate("/store")}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2F8F6A]/15 bg-white px-4 py-2 text-sm font-semibold text-[#2F8F6A] shadow-sm transition hover:bg-[#2F8F6A]/5"
          >
            <ArrowLeft size={16} />
            Back to Store
          </button>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-start">
            <section className="min-w-0">
              <div className="overflow-hidden rounded-[32px] border border-[#2F8F6A]/10 bg-white shadow-[0_24px_80px_rgba(47,143,106,0.14)]">
                <div className="relative h-[300px] bg-[#F4FAF7] sm:h-[460px] lg:h-[560px]">
                  <img
                    src={activeImg}
                    alt={product.name}
                    className="h-full w-full object-contain p-6 sm:p-10"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#062D1D]/85 to-transparent p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                      {categoryName}
                    </p>
                    <h1 className="mt-1 line-clamp-2 text-2xl font-bold sm:text-4xl">
                      {product.name}
                    </h1>
                  </div>
                </div>
              </div>

              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-3 gap-3 sm:flex sm:flex-wrap">
                  {images.map((image) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImg(image)}
                      className={`h-24 overflow-hidden rounded-2xl border bg-white p-2 transition sm:w-28 ${
                        activeImg === image
                          ? "border-[#2F8F6A] ring-2 ring-[#2F8F6A]/20"
                          : "border-[#2F8F6A]/10 hover:border-[#2F8F6A]/40"
                      }`}
                    >
                      <img src={image} alt="" className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </section>

            <aside className="lg:sticky lg:top-[112px]">
              <div className="rounded-[32px] border border-[#2F8F6A]/10 bg-white p-5 shadow-[0_24px_80px_rgba(47,143,106,0.12)] sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2F8F6A]">
                  {categoryName}
                </p>
                <h2 className="mt-2 text-2xl font-bold leading-tight text-gray-950 sm:text-3xl">
                  {product.name}
                </h2>

                {product.description && (
                  <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                    {product.description}
                  </p>
                )}

                <div className="mt-6 rounded-[26px] bg-[#F7FCF9] p-5 ring-1 ring-[#2F8F6A]/10">
                  {price > 0 ? (
                    <>
                      <p className="text-sm font-medium text-gray-500">Price including GST</p>
                      <div className="mt-1 flex flex-wrap items-end gap-2">
                        <span className="text-3xl font-extrabold text-gray-950">
                          &#8377;{fmt(priceWithGst)}
                        </span>
                        <span className="pb-1 text-xs font-semibold text-[#2F8F6A]">
                          incl. {gstPct}% GST
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Base price: &#8377;{fmt(price)}
                      </p>
                    </>
                  ) : (
                    <p className="text-lg font-bold text-gray-900">Price on request</p>
                  )}
                </div>

                {productFacts.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {productFacts.map(({ label, value, icon: Icon }) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-[#2F8F6A]/10 bg-white p-4 shadow-sm"
                      >
                        <Icon size={16} className="mb-2 text-[#2F8F6A]" />
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="mt-1 line-clamp-2 text-sm font-bold text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleAddToQuote}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F8F6A] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#2F8F6A]/20 transition hover:bg-[#0A8B41]"
                  >
                    <ShoppingCart size={17} />
                    {inQuote ? "Add More" : "Add to Quote"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/store/quotation")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#2F8F6A]/15 bg-white px-5 py-3 text-sm font-bold text-[#2F8F6A] transition hover:bg-[#2F8F6A]/5"
                  >
                    View Quote
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
