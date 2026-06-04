import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSinglePremium from "../components/HeroSlider.jsx";
import ProductCard from "../components/ProductCard.jsx";
import api from "../api/axios";
import SocialFloating from "../components/SocialFloating";
import LayeredLoader from "../components/Loader";
import Seo from "../components/Seo";


const heroImage =
  "https://backend.infinityenergy.xyz/uploads/media/producthero.webp";

export default function Productpage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState("all");
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [prodRes, catRes] = await Promise.all([
        api.get("/products"),
        api.get("/product-categories"), // 👈 make sure this matches your route
      ]);

      setProducts(prodRes.data?.data?.data || []);
      setCategories(catRes.data?.data?.data || []);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchAll();
  }, []);

  // ✅ filter products by category
  const filteredProducts =
    activeCat === "all"
      ? products
      : products.filter((p) => p.category?.id === activeCat);

  return (
    <>
      <Seo
        title="Battery & Energy Storage Products | Infinity Energy"
        description="Explore Infinity Energy’s lithium batteries, solar storage systems, and power backup solutions."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Battery & Energy Storage Products",
          "description": "Explore Infinity Energy’s lithium batteries, solar storage systems, and power backup solutions.",
          "url": "https://www.infinityenergy.xyz/productpage"
        }}
      />

      <Header />
      <main className="pt-0 px-4 md:px-4 space-y-8">
        <section>
          <HeroSinglePremium
            image={heroImage}
            title="Products"
            subtitle="Explore our diverse range of products designed to meet your needs."
          />
        </section>

        {/* 🔖 Category Menu */}
        <section className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setActiveCat("all")}
            className={`px-5 py-2 rounded-2xl border transition ${activeCat === "all"
              ? "bg-black text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-5 py-2 rounded-2xl border transition ${activeCat === cat.id
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </section>

        {loading ? (
          <div className="py-24">
            <LayeredLoader size={50} />
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            {filteredProducts.map((item) => {
              const primaryImg = item.images?.find(
                (i) => i.is_primary
              )?.image;

              return (
                <ProductCard
                  key={item.id}
                  title={item.name}
                  price={item.short_description}
                  image={
                    primaryImg
                      ? `https://backend.infinityenergy.xyz/${primaryImg}`
                      : "https://via.placeholder.com/600x600?text=No+Image"
                  }
                  href={`/shop/${item.slug}`}
                />
              );
            })}
          </section>
        )}
      </main>
      <SocialFloating />
      <Footer />
    </>
  );
}
