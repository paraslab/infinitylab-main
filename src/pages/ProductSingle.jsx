import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api/axios";
import QuoteCard from "../components/QuoteCard";
import SocialFloating from "../components/SocialFloating";
import LayeredLoader from "../components/Loader";
import SpecBlock from "../components/SpecBlock";

const BASE_URL = "https://backend.infinityenergy.xyz/";

export default function ProductSingle() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [specs, setSpecs] = useState({});
  const [activeImg, setActiveImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // ✅ WhatsApp Enquiry
  const handleEnquiry = () => {
    const phone = "918866189016";
    const message = `Hello, I am interested in the product: ${product?.name}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  };

  // ✅ Download Active Image
  const handleDownloadImage = async () => {
    if (!activeImg) return;

    try {
      const res = await fetch(activeImg);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${product?.name || "product"}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Image download failed", err);
      alert("Download failed. Please try again.");
    }
  };

  // ✅ Copy link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      alert("Copy failed.");
    }
  };

  // ✅ Share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name || "Product",
          text: product?.short_description || "",
          url: window.location.href,
        });
      } else {
        handleCopyLink();
      }
    } catch (e) {}
  };

  // ✅ Remove empty/null spec rows
  const cleanSpecs = useMemo(() => {
    const cleaned = {};

    Object.entries(specs || {}).forEach(([section, items]) => {
      const filtered = (items || []).filter((item) => {
        const param = item?.parameter?.toString()?.trim();
        const val = item?.value?.toString()?.trim();
        return param && val && val !== "-" && val.toLowerCase() !== "null";
      });

      if (filtered.length > 0) cleaned[section] = filtered;
    });

    return cleaned;
  }, [specs]);

  // ✅ Product Info Cards (hide empty)
  const productInfo = useMemo(() => {
    if (!product) return [];

    const rows = [
      { label: "Battery Type", value: product.battery_type },
      {
        label: "Capacity",
        value: product.capacity_kwh ? `${product.capacity_kwh} kWh` : null,
      },
      {
        label: "Rated Power",
        value: product.rated_power_mw ? `${product.rated_power_mw} MW` : null,
      },
      { label: "Voltage Range", value: product.voltage_range },
      {
        label: "Rated Voltage",
        value: product.rated_voltage ? `${product.rated_voltage} Vdc` : null,
      },
    ];

    return rows.filter((r) => r.value && r.value.toString().trim() !== "");
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/products/${slug}`);
        const data = res.data?.data;

        setProduct(data?.product || null);
        setSpecs(data?.specifications || {});

        const primary =
          data?.product?.images?.find((i) => i.is_primary)?.image ||
          data?.product?.images?.[0]?.image ||
          "";

        setActiveImg(primary ? BASE_URL + primary : "");
      } catch (err) {
        console.error("Failed to fetch product", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex justify-center items-center">
          <LayeredLoader />
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="py-32 text-center text-gray-500">Product not found</div>
        <Footer />
      </>
    );
  }

  // ✅ Datasheet (if your API provides it)
  // Example: product.datasheet OR product.pdf OR product.brochure
  const datasheetUrl = product?.datasheet
    ? BASE_URL + product.datasheet
    : product?.pdf
    ? BASE_URL + product.pdf
    : product?.brochure
    ? BASE_URL + product.brochure
    : null;

  return (
    <>
      <Header />

      <QuoteCard image={activeImg} quote={product.short_description} />

      {/* Premium Background */}
      <main className=" from-emerald-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          {/* TOP SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-14">
            {/* LEFT: IMAGES */}
            <div>
              <div className="rounded-3xl overflow-hidden border border-emerald-100 shadow-sm bg-white relative">
                {activeImg ? (
                  <img
                    src={activeImg}
                    alt={product.name}
                    className="w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover"
                  />
                ) : (
                  <div className="h-[320px] sm:h-[420px] lg:h-[520px] flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}


              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  {product.images.map((img, i) => {
                    const url = BASE_URL + img.image;
                    const isActive = activeImg === url;

                    return (
                      <button
                        key={i}
                        onClick={() => setActiveImg(url)}
                        className={`w-20 h-20 rounded-2xl overflow-hidden border transition
                          ${
                            isActive
                              ? "ring-2 ring-emerald-500 border-emerald-200"
                              : "border-emerald-100 hover:border-emerald-300"
                          }`}
                        title="View image"
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT: INFO (Sticky on Desktop) */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="rounded-3xl  border-emerald-100 bg-white shadow-sm  sm:p-8">
                <p className="text-xs uppercase tracking-widest text-emerald-600 font-semibold mb-2">
                  {product.category?.name}
                </p>

                <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
                  {product.name}
                </h1>

                {product.description && (
                  <p className="text-gray-600 leading-relaxed mb-7">
                    {product.description}
                  </p>
                )}

                {/* PRODUCT INFO */}
                {productInfo.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {productInfo.map((row, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl bg-emerald-50/50 border border-emerald-100 px-4 py-3"
                      >
                        <p className="text-gray-500 text-xs mb-1">{row.label}</p>
                        <p className="font-semibold text-gray-900">
                          {row.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleEnquiry}
                    className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#2F8F6A] text-white font-semibold hover:bg-[#256f53] transition"
                  >
                    Enquiry Now
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto px-8 py-3 rounded-2xl border border-emerald-200 bg-white text-gray-800 font-semibold hover:bg-emerald-50 transition"
                  >
                    {copied ? "✅ Copied!" : "📋 Copy Link"}
                  </button>

                  <button
                    onClick={() => navigate(-1)}
                    className="w-full sm:w-auto px-8 py-3 rounded-2xl border border-emerald-200 bg-white text-gray-800 font-semibold hover:bg-emerald-50 transition"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SPECIFICATIONS */}
          <div className="mt-14">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Specifications
              </h2>

              <p className="text-sm text-gray-500">
                Showing only valid specification rows (auto cleaned)
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
              {/* LEFT */}
              <div className="space-y-10">
                <SpecBlock title="General" items={cleanSpecs["General"]} />
                <SpecBlock title="DC Side" items={cleanSpecs["DC Side"]} />
              </div>

              {/* RIGHT */}
              <div className="space-y-10">
                <SpecBlock title="AC Side" items={cleanSpecs["AC Side"]} />

                {/* EXTRA SECTIONS */}
                {Object.entries(cleanSpecs)
                  .filter(
                    ([key]) => !["DC Side", "AC Side", "General"].includes(key)
                  )
                  .map(([section, items]) => (
                    <SpecBlock key={section} title={section} items={items} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SocialFloating />
      <Footer />
    </>
  );
}
