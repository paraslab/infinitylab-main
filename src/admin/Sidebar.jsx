import React from "react";

export default function Sidebar({ isOpen, onClose, onSelect, active }) {
  const items = [
    { key: "dashboard", label: "Dashboard" },
    { key: "testimonials", label: "Testimonials" },
    { key: "product", label: "Product" },
    { key: "blog", label: "Blog" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold">Admin Menu</h2>
          <button onClick={onClose} className="text-2xl">
            ✕
          </button>
        </div>

        <ul className="p-4 space-y-2">
          {items.map((item) => (
            <li
              key={item.key}
              onClick={() => {
                onSelect(item.key);
                onClose();
              }}
              className={`p-2 rounded cursor-pointer
                ${
                  active === item.key
                    ? "bg-gray-700"
                    : "hover:bg-gray-800"
                }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        />
      )}
    </>
  );
}
