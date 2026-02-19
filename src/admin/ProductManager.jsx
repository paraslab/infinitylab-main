import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ProductSpecifications from "./ProductSpecifications";
import LayeredLoader from "../components/Loader";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(res.data.data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: Product List */}
      <div className="bg-white rounded-xl shadow p-4 min-h-[300px]">
        <h2 className="font-semibold mb-3">Products</h2>

        <button
          onClick={() => setActiveProduct({})}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg mb-4"
        >
          + Add Product
        </button>

        {loading ? (
          <div className="flex justify-center mt-10">
            <LayeredLoader />
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveProduct(p)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Editor */}
      <div className="lg:col-span-2">
        {activeProduct ? (
          <ProductEditor
            product={activeProduct}
            onSaved={() => {
              setActiveProduct(null);
              loadProducts();
            }}
          />
        ) : (
          <div className="bg-white p-6 rounded-xl shadow text-gray-500">
            Select or create a product
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= PRODUCT EDITOR ================= */

function ProductEditor({ product, onSaved }) {
  const [form, setForm] = useState({
    name: product.name || "",
    short_description: product.short_description || "",
    description: product.description || "",
    battery_type: product.battery_type || "",
    capacity_kwh: product.capacity_kwh || "",
    rated_power_mw: product.rated_power_mw || "",
    voltage_range: product.voltage_range || "",
    rated_voltage: product.rated_voltage || "",
  });

  const [images, setImages] = useState([]);
  const [productId, setProductId] = useState(product.id || null);
  const [saving, setSaving] = useState(false);

  const saveProduct = async () => {
    setSaving(true);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach((img) => fd.append("images[]", img));

    try {
      const res = await api.post("/products", fd);
      setProductId(res.data.data.id);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* PRODUCT FORM */}
      <div className="bg-white p-6 rounded-xl shadow relative">
        <h2 className="font-semibold mb-4">Product Details</h2>

        {saving && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl z-10">
            <LayeredLoader />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {[
            ["name", "Product Name"],
            ["battery_type", "Battery Type"],
            ["capacity_kwh", "Capacity (kWh)"],
            ["rated_power_mw", "Rated Power (MW)"],
            ["voltage_range", "Voltage Range"],
            ["rated_voltage", "Rated Voltage"],
          ].map(([key, label]) => (
            <input
              key={key}
              placeholder={label}
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
              className="input"
              disabled={saving}
            />
          ))}
        </div>

        <textarea
          placeholder="Short Description"
          value={form.short_description}
          onChange={(e) =>
            setForm({ ...form, short_description: e.target.value })
          }
          className="input mt-3"
          disabled={saving}
        />

        <textarea
          placeholder="Full Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="input mt-3 h-28"
          disabled={saving}
        />

        <input
          type="file"
          multiple
          onChange={(e) => setImages([...e.target.files])}
          className="mt-3"
          disabled={saving}
        />

        <button
          onClick={saveProduct}
          disabled={saving}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg disabled:opacity-60"
        >
          Save Product
        </button>
      </div>

      {/* SPECIFICATIONS */}
      {productId && <ProductSpecifications productId={productId} />}
    </div>
  );
}
