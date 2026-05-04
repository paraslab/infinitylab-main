import React, { useState } from "react";
import { ShoppingCart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../store/CartContext";
import toast from "react-hot-toast";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://backend.infinityenergy.xyz";

function getImageUrl(product) {
  // store_products uses image_1 / image_2 / image_3 (storage paths)
  const img = product.image_1 || product.image_2 || product.image_3;
  if (!img) return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("store-products/") || img.startsWith("storage/")) {
    return `${BACKEND}/storage/${img.replace(/^storage\//, "")}`;
  }
  return `${BACKEND}/${img}`;
}

export default function StoreProductCard({ product }) {
  const [loaded, setLoaded] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const imgSrc =
    getImageUrl(product) ||
    "https://via.placeholder.com/400x400?text=No+Image";

  const price = parseFloat(product.price || 0);
  const gstPct = parseFloat(product.gst_percent || 0);
  const priceWithGst = price + (price * gstPct) / 100;

  const handleAddToQuote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to quote`);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 flex flex-col">
      {/* Image */}
      <div className="relative h-56 bg-gray-50 overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-contain p-4 transition-all duration-500 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Category badge */}
        {(product.store_category?.name || product.category?.name) && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-600 px-2.5 py-1 rounded-full shadow-sm">
            {product.store_category?.name || product.category?.name}
          </span>
        )}

        {product.featured && (
          <span className="absolute top-3 right-3 bg-amber-400 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1 line-clamp-2">
          {product.name}
        </h3>

        {product.model && (
          <p className="text-xs text-gray-400 mb-2">Model: {product.model}</p>
        )}

        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
            {product.description}
          </p>
        )}

        {/* Pricing */}
        <div className="mt-auto">
          {price > 0 ? (
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">
                  ₹{priceWithGst.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
                <span className="text-xs text-gray-400">incl. {gstPct}% GST</span>
              </div>
              <p className="text-xs text-gray-400">
                ₹{price.toLocaleString("en-IN", { maximumFractionDigits: 0 })} + GST
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-4">Price on request</p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/shop/${product.slug}`)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye size={15} />
              Details
            </button>
            <button
              onClick={handleAddToQuote}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <ShoppingCart size={15} />
              Add to Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
