import React, { useEffect, useRef, useState } from "react";
import api from "../api/axios";

export default function ProductCategoryManager() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/product-categories");
      setList(res.data?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const resetForm = () => {
    setForm({ name: "", description: "" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return alert("Name required");

    try {
      if (editId) {
        await api.post(`/product-categories/${editId}`, form);
      } else {
        await api.post("/product-categories", form);
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save category");
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      description: item.description || "",
    });
  };

  const handleDelete = async (item) => {
    if (!confirm("Delete this category?")) return;
    await api.delete(`/product-categories/${item.id}`);
    fetchCategories();
  };

  const toggleStatus = async (item) => {
    await api.patch(`/product-categories/${item.id}/toggle-status`);
    fetchCategories();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6">📦 Product Categories</h2>

      {/* Form Box */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 border rounded-xl p-5 mb-8 space-y-3"
      >
        <h3 className="font-semibold">
          {editId ? "✏️ Update Category" : "➕ Add Category"}
        </h3>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Category name"
          className="border p-2 rounded-lg w-full"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          className="border p-2 rounded-lg w-full"
          rows={3}
        />

        <div className="flex gap-2">
          <button className="bg-black text-white px-5 py-2 rounded-lg">
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 px-5 py-2 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : list.length === 0 ? (
        <p className="text-gray-500">No categories found</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {list.map((c) => (
            <div
              key={c.id}
              className="bg-white border rounded-2xl p-4 shadow hover:shadow-lg transition space-y-2"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold truncate">{c.name}</h4>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    c.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.status ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-3">
                {c.description || "No description"}
              </p>

              <div className="flex justify-between text-xs pt-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleStatus(c)}
                  className="text-amber-600"
                >
                  Toggle
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
