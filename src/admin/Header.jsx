import React from "react";

export default function Header({ onOpen }) {
  return (
    <header className="bg-white shadow px-4 py-3 flex items-center gap-4">
      <button onClick={onOpen} className="text-2xl text-gray-700">
        ☰
      </button>
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
    </header>
  );
}
