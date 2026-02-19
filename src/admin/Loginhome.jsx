import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiMessageSquare,
  FiBox,
  FiFileText,
  FiInbox,
  FiImage,
  FiGrid,
  FiLogOut,
} from "react-icons/fi";

import Testimonials from "./Testimonials";
import Blog from "./Blog";
import Inquiries from "./Inquiries";
import MediaManager from "./MediaManager";
import ProductCategoryManager from "./ProductCategoryManager";
import ProductManager from "./ProductManager.jsx";

export default function Loginhome() {
  const [page, setPage] = useState("dashboard");

  /* 🔐 AUTH GUARD */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const menu = [
    { key: "dashboard", label: "Dashboard", icon: FiHome },
    { key: "testimonials", label: "Testimonials", icon: FiMessageSquare },
    { key: "products", label: "Products", icon: FiBox },
    { key: "blog", label: "Blog", icon: FiFileText },
    { key: "inquiries", label: "Inquiries", icon: FiInbox },
    { key: "media", label: "Media", icon: FiImage },
    { key: "product-categories", label: "Categories", icon: FiGrid },
  ];

  const renderPage = () => {
    if (page === "dashboard") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Testimonials", value: "24" },
            { title: "Blogs", value: "12" },
            { title: "Inquiries", value: "5 New" },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow p-6"
            >
              <h3 className="text-gray-500 text-sm">{card.title}</h3>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>
      );
    }

    if (page === "testimonials") return <Testimonials />;
    if (page === "blog") return <Blog />;
    if (page === "inquiries") return <Inquiries />;
    if (page === "media") return <MediaManager />;
    if (page === "product-categories") return <ProductCategoryManager />;
    if (page === "products") return <ProductManager />;

    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold capitalize">{page}</h2>
        <p className="text-gray-500 mt-2">
          This section is coming soon...
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-xl">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          🚀 Admin
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = page === item.key;

            return (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${active
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
              >
                <Icon className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-xl font-semibold"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold capitalize">
            {page.replace("-", " ")}
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
              A
            </div>
            <span className="text-gray-700 font-medium">Admin</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
