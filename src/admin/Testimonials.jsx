import React, { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Testimonials() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    designation: "",
    message: "",
    image: null,
  });

  const [editId, setEditId] = useState(null);
  const hasFetched = useRef(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/testimonials");
      setList(res.data?.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((p) => ({ ...p, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("designation", form.designation);
    fd.append("message", form.message);
    if (form.image) fd.append("image", form.image);

    const toastId = toast.loading(editId ? "Updating testimonial..." : "Adding testimonial...");

    try {
      if (editId) {
        await api.post(`/testimonials/${editId}?_method=POST`, fd);
        toast.success("Testimonial updated successfully!", { id: toastId });
      } else {
        await api.post("/testimonials", fd);
        toast.success("Testimonial added successfully!", { id: toastId });
      }

      setForm({ name: "", designation: "", message: "", image: null });
      setEditId(null);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save testimonial", { id: toastId });
    }
  };

  const handleEdit = (t) => {
    setEditId(t.id);
    setForm({
      name: t.name || "",
      designation: t.designation || "",
      message: t.message || "",
      image: null,
    });
  };

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span>Delete this testimonial?</span>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 rounded bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const delToast = toast.loading("Deleting...");
              try {
                await api.delete(`/testimonials/${id}`);
                toast.success("Deleted successfully", { id: delToast });
                fetchTestimonials();
              } catch {
                toast.error("Delete failed", { id: delToast });
              }
            }}
            className="px-3 py-1 rounded bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 6000 });
  };

  const toggleStatus = async (id) => {
    const toastId = toast.loading("Updating status...");
    try {
      await api.post(`/testimonials/toggle-status/${id}`);
      toast.success("Status updated", { id: toastId });
      fetchTestimonials();
    } catch {
      toast.error("Status update failed", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Testimonials</h2>
      </div>

      {/* 🔹 Form Card */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">
          {editId ? "Edit Testimonial" : "Add New Testimonial"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="border rounded-lg px-3 py-2"
            required
          />

          <input
            type="text"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            placeholder="Designation"
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700"
          >
            {editId ? "Update" : "Add"}
          </button>

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Message"
            rows="3"
            className="border rounded-lg px-3 py-2 md:col-span-4"
            required
          />
        </form>
      </div>

      {/* 🔹 List Card */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b font-semibold">
          All Testimonials
        </div>

        {loading ? (
          <p className="p-6">Loading...</p>
        ) : list.length === 0 ? (
          <p className="p-6 text-gray-500">No testimonials found.</p>
        ) : (
          <div className="divide-y">
            {list.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  {t.image && (
                    <img
                      src={`${BACKEND_URL}/${t.image}`}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-gray-500">
                      {t.designation}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {t.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      t.status
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {t.status ? "Active" : "Inactive"}
                  </span>

                  <button
                    onClick={() => toggleStatus(t.id)}
                    className="text-indigo-600 hover:underline"
                  >
                    Toggle
                  </button>

                  <button
                    onClick={() => handleEdit(t)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
