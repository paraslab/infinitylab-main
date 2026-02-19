import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function ProductSpecifications({ productId }) {
  const [specs, setSpecs] = useState([]);
  const [form, setForm] = useState({
    section: "DC Side",
    parameter: "",
    value: "",
  });

  useEffect(() => {
    loadSpecs();
  }, []);

  const loadSpecs = async () => {
    const res = await api.get(
      `/product-specifications?product_id=${productId}`
    );
    setSpecs(res.data.data);
  };

  const addSpec = async () => {
    await api.post("/product-specifications", {
      product_id: productId,
      ...form,
    });
    setForm({ ...form, parameter: "", value: "" });
    loadSpecs();
  };

  const grouped = specs.reduce((acc, s) => {
    acc[s.section] = acc[s.section] || [];
    acc[s.section].push(s);
    return acc;
  }, {});

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Specifications</h2>

      {/* ADD SPEC */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <select
          value={form.section}
          onChange={(e) =>
            setForm({ ...form, section: e.target.value })
          }
          className="input"
        >
          <option>DC Side</option>
          <option>AC Side</option>
          <option>General</option>
        </select>

        <input
          placeholder="Parameter"
          value={form.parameter}
          onChange={(e) =>
            setForm({ ...form, parameter: e.target.value })
          }
          className="input"
        />

        <input
          placeholder="Value"
          value={form.value}
          onChange={(e) =>
            setForm({ ...form, value: e.target.value })
          }
          className="input"
        />

        <button
          onClick={addSpec}
          className="bg-green-600 text-white rounded-lg"
        >
          Add
        </button>
      </div>

      {/* SPEC LIST */}
      {Object.keys(grouped).map((section) => (
        <div key={section} className="mb-4">
          <h3 className="font-semibold text-indigo-600">
            {section}
          </h3>

          <ul className="mt-2 space-y-1 text-sm">
            {grouped[section].map((s) => (
              <li
                key={s.id}
                className="flex justify-between bg-gray-50 px-3 py-2 rounded"
              >
                <span>{s.parameter}</span>
                <span className="text-gray-600">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
