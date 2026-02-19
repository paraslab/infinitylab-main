import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api/axios";
import QuoteCard from "../components/QuoteCard";
import SocialFloating from "../components/SocialFloating";
import LayeredLoader from "../components/Loader";

const BASE_URL = "https://backend.infinityenergy.xyz/";

export default function ProductSingle() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [specs, setSpecs] = useState({});
  const [activeImg, setActiveImg] = useState("");
  const [loading, setLoading] = useState(true);

  const handleEnquiry = () => {
    const phone = "918866189016";
    const message = `Hello, I am interested in the product: ${product?.name}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
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

  // ✅ Simple Spec Block (No borders, clean)
  const SpecBlock = ({ title, items }) => {
    if (!items || items.length === 0) return null;

    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1"
            >
              <span className="text-sm text-gray-600 max-w-[70%]">
                {item.parameter}
              </span>

              <span className="text-sm font-semibold text-gray-900 sm:text-right">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />

      <QuoteCard image={activeImg} quote={product.short_description} />

      {/* LIGHT BACKGROUND */}
      <main className="bg-gradient-to-b from-emerald-50/40 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          {/* TOP SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-14">
            {/* IMAGES */}
            <div>
              <div className="rounded-3xl overflow-hidden border border-emerald-100 shadow-sm mb-4 bg-white">
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

              {product.images?.length > 1 && (
                <div className="flex gap-3 flex-wrap">
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

            {/* INFO */}
            <div className="rounded-3xl sm:p-2">
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
                      className="rounded-2xl bg-white border border-emerald-100 px-4 py-3 shadow-sm"
                    >
                      <p className="text-gray-500 text-xs mb-1">{row.label}</p>
                      <p className="font-semibold text-gray-900">{row.value}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleEnquiry}
                  className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#2F8F6A] text-white font-semibold hover:bg-[#256f53] transition"
                >
                  Enquiry Now
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

          {/* SPECIFICATIONS (PERFECT LIKE YOUR SCREENSHOT) */}
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Specifications
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
              {/* LEFT COLUMN */}
              <div className="space-y-10">
                <SpecBlock title="General" items={cleanSpecs["General"]} />
                <SpecBlock title="DC Side" items={cleanSpecs["DC Side"]} />
              </div>

              {/* RIGHT COLUMN */}
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



















//////////
// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import api from "../api/axios";
// import QuoteCard from "../components/QuoteCard";
// import SocialFloating from "../components/SocialFloating";
// import LayeredLoader from "../components/Loader";

// const BASE_URL = "https://backend.infinityenergy.xyz/";

// export default function ProductSingle() {
//   const { slug } = useParams();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState(null);
//   const [specs, setSpecs] = useState({});
//   const [activeImg, setActiveImg] = useState("");
//   const [loading, setLoading] = useState(true);

//   const handleEnquiry = () => {
//     const phone = "918866189016";
//     const message = `Hello, I am interested in the product: ${product?.name}`;
//     window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
//   };

//   // ✅ Remove empty/null spec rows
//   const cleanSpecs = useMemo(() => {
//     const cleaned = {};

//     Object.entries(specs || {}).forEach(([section, items]) => {
//       const filtered = (items || []).filter((item) => {
//         const param = item?.parameter?.toString()?.trim();
//         const val = item?.value?.toString()?.trim();
//         return param && val && val !== "-" && val.toLowerCase() !== "null";
//       });

//       if (filtered.length > 0) {
//         cleaned[section] = filtered;
//       }
//     });

//     return cleaned;
//   }, [specs]);

//   // ✅ Safe Product Fields (hide if empty)
//   const productInfo = useMemo(() => {
//     if (!product) return [];

//     const rows = [
//       { label: "Battery Type", value: product.battery_type },
//       { label: "Capacity", value: product.capacity_kwh ? `${product.capacity_kwh} kWh` : null },
//       { label: "Rated Power", value: product.rated_power_mw ? `${product.rated_power_mw} MW` : null },
//       { label: "Voltage Range", value: product.voltage_range },
//       { label: "Rated Voltage", value: product.rated_voltage ? `${product.rated_voltage} Vdc` : null },
//     ];

//     return rows.filter((r) => r.value && r.value.toString().trim() !== "");
//   }, [product]);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);

//         const res = await api.get(`/products/${slug}`);
//         const data = res.data?.data;

//         setProduct(data?.product || null);
//         setSpecs(data?.specifications || {});

//         const primary =
//           data?.product?.images?.find((i) => i.is_primary)?.image ||
//           data?.product?.images?.[0]?.image ||
//           "";

//         setActiveImg(primary ? BASE_URL + primary : "");
//       } catch (err) {
//         console.error("Failed to fetch product", err);
//         setProduct(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [slug]);

//   if (loading) {
//     return (
//       <>
//         <Header />
//         <div className="min-h-[60vh] flex justify-center items-center">
//           <LayeredLoader />
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   if (!product) {
//     return (
//       <>
//         <Header />
//         <div className="py-32 text-center text-gray-500">
//           Product not found
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // Helper: render section only if data exists
//   const SpecSection = ({ title, items }) => {
//     if (!items || items.length === 0) return null;

//     return (
//       <div className="rounded-3xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
//         <div className="px-5 py-4 bg-emerald-50 border-b border-emerald-100">
//           <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//         </div>

//         <div className="p-5 space-y-3">
//           {items.map((item) => (
//             <div
//               key={item.id}
//               className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
//             >
//               <span className="text-sm text-gray-600">
//                 {item.parameter}
//               </span>
//               <span className="text-sm font-semibold text-gray-900 sm:text-right">
//                 {item.value}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <Header />

//       <QuoteCard image={activeImg} quote={product.short_description} />

//       {/* LIGHT BACKGROUND */}
//       <main className="bg-gradient-to-b from-emerald-50/50 to-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">

//           {/* TOP SECTION */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-14">

//             {/* IMAGES */}
//             <div>
//               <div className="rounded-3xl overflow-hidden border border-emerald-100 shadow-sm mb-4">
//                 {activeImg ? (
//                   <img
//                     src={activeImg}
//                     alt={product.name}
//                     className="w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover"
//                   />
//                 ) : (
//                   <div className="h-[320px] sm:h-[420px] lg:h-[520px] flex items-center justify-center text-gray-400">
//                     No Image Available
//                   </div>
//                 )}
//               </div>

//               {product.images?.length > 1 && (
//                 <div className="flex gap-3 flex-wrap">
//                   {product.images.map((img, i) => {
//                     const url = BASE_URL + img.image;
//                     const isActive = activeImg === url;

//                     return (
//                       <button
//                         key={i}
//                         onClick={() => setActiveImg(url)}
//                         className={`w-20 h-20 rounded-2xl overflow-hidden border transition
//                           ${isActive
//                             ? "ring-2 ring-emerald-500 border-emerald-200"
//                             : "border-emerald-100 hover:border-emerald-300"
//                           }`}
//                       >
//                         <img
//                           src={url}
//                           alt=""
//                           className="w-full h-full object-cover"
//                         />
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* INFO */}
//             <div className=" rounded-3xl sm:p-8">
//               <p className="text-xs uppercase tracking-widest text-emerald-600 font-semibold mb-2">
//                 {product.category?.name}
//               </p>

//               <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
//                 {product.name}
//               </h1>

//               {product.description && (
//                 <p className="text-gray-600 leading-relaxed mb-7">
//                   {product.description}
//                 </p>
//               )}

//               {/* PRODUCT INFO (NO NULL ROWS) */}
//               {productInfo.length > 0 && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                   {productInfo.map((row, idx) => (
//                     <div
//                       key={idx}
//                       className="rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-3"
//                     >
//                       <p className="text-gray-500 text-xs mb-1">
//                         {row.label}
//                       </p>
//                       <p className="font-semibold text-gray-900">
//                         {row.value}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <div className="mt-8 flex flex-col sm:flex-row gap-3">
//                 <button
//                   onClick={handleEnquiry}
//                   className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#2F8F6A] text-white font-semibold hover:bg-[#256f53] transition"
//                 >
//                   Enquiry Now
//                 </button>

//                 <button
//                   onClick={() => navigate(-1)}
//                   className="w-full sm:w-auto px-8 py-3 rounded-2xl border border-emerald-200 bg-white text-gray-800 font-semibold hover:bg-emerald-50 transition"
//                 >
//                   ← Back
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* SPECIFICATIONS */}
//           {/* SPECIFICATIONS */}
//           <div className="mt-12">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">
//               Specifications
//             </h2>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

//               {/* LEFT COLUMN */}
//               <div className="space-y-10">
//                 {/* DC SIDE */}
//                 {cleanSpecs["DC Side"]?.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                       DC Side
//                     </h3>

//                     <div className="space-y-3">
//                       {cleanSpecs["DC Side"].map((item) => (
//                         <div
//                           key={item.id}
//                           className="flex flex-col sm:flex-row sm:justify-between gap-1"
//                         >
//                           <span className="text-sm text-gray-600">
//                             {item.parameter}
//                           </span>
//                           <span className="text-sm font-semibold text-gray-900 sm:text-right">
//                             {item.value}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* GENERAL */}
//                 {cleanSpecs["General"]?.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                       General
//                     </h3>

//                     <div className="space-y-3">
//                       {cleanSpecs["General"].map((item) => (
//                         <div
//                           key={item.id}
//                           className="flex flex-col sm:flex-row sm:justify-between gap-1"
//                         >
//                           <span className="text-sm text-gray-600">
//                             {item.parameter}
//                           </span>
//                           <span className="text-sm font-semibold text-gray-900 sm:text-right">
//                             {item.value}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* RIGHT COLUMN */}
//               <div className="space-y-10">
//                 {/* AC SIDE */}
//                 {cleanSpecs["AC Side"]?.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                       AC Side
//                     </h3>

//                     <div className="space-y-3">
//                       {cleanSpecs["AC Side"].map((item) => (
//                         <div
//                           key={item.id}
//                           className="flex flex-col sm:flex-row sm:justify-between gap-1"
//                         >
//                           <span className="text-sm text-gray-600">
//                             {item.parameter}
//                           </span>
//                           <span className="text-sm font-semibold text-gray-900 sm:text-right">
//                             {item.value}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* EXTRA SECTIONS (if backend sends more) */}
//                 {Object.entries(cleanSpecs)
//                   .filter(([key]) => !["DC Side", "AC Side", "General"].includes(key))
//                   .map(([section, items]) => (
//                     <div key={section}>
//                       <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                         {section}
//                       </h3>

//                       <div className="space-y-3">
//                         {items.map((item) => (
//                           <div
//                             key={item.id}
//                             className="flex flex-col sm:flex-row sm:justify-between gap-1"
//                           >
//                             <span className="text-sm text-gray-600">
//                               {item.parameter}
//                             </span>
//                             <span className="text-sm font-semibold text-gray-900 sm:text-right">
//                               {item.value}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//               </div>

//             </div>
//           </div>

//         </div>
//       </main>

//       <SocialFloating />
//       <Footer />
//     </>
//   );
// }
