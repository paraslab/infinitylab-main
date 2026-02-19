import React, { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import LayeredLoader from "../components/Loader";


export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    short_description: "",
    description: "",
    image: null,
  });

  // ================= FETCH BLOGS =================
  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blogs");
      setBlogs(res.data?.data?.data || []);
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ================= RESET =================
  const resetForm = () => {
    setForm({
      title: "",
      short_description: "",
      description: "",
      image: null,
    });
    setEditId(null);
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("short_description", form.short_description);
    fd.append("description", form.description);

    if (form.image instanceof File) {
      fd.append("image", form.image);
    }

    try {
      if (editId) {
        // 🔥 Laravel method spoofing
        fd.append("_method", "POST");
        await api.post(`/blogs/${editId}`, fd);
        toast.success("Blog updated");
      } else {
        await api.post("/blogs", fd);
        toast.success("Blog created");
      }

      resetForm();
      fetchBlogs();
    } catch (err) {
      if (err.response?.status === 422) {
        Object.values(err.response.data.errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error("Save failed");
      }
    }
  };

  // ================= EDIT =================
  const handleEdit = (blog) => {
    setEditId(blog.id);
    setForm({
      title: blog.title,
      short_description: blog.short_description || "",
      description: blog.description,
      image: null,
    });
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Blog deleted");
      fetchBlogs();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= TOGGLE STATUS =================
  const toggleStatus = async (id) => {
    try {
      await api.patch(`/blogs/${id}/toggle-status`);
      fetchBlogs();
    } catch {
      toast.error("Status update failed");
    }
  };

  // ================= UI =================
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {editId ? "Edit Blog" : "Create Blog"}
        </h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="short_description"
          value={form.short_description}
          onChange={handleChange}
          placeholder="Short Description"
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded h-32"
          required
        />

        <input
          type="file"
          name="image"
          onChange={handleChange}
          key={editId || "new"} // 🔥 IMPORTANT: resets file input
          className="w-full"
        />

        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? "Update" : "Create"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ================= LIST ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Blogs</h2>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LayeredLoader />
          </div>
        ) : (

          <div className="space-y-3">
            {blogs.map((b) => (
              <div
                key={b.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{b.title}</p>
                  <span
                    className={`text-sm ${b.status ? "text-green-600" : "text-red-500"
                      }`}
                  >
                    {b.status ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(b)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleStatus(b.id)}
                    className="text-yellow-600"
                  >
                    Toggle
                  </button>

                  <button
                    onClick={() => handleDelete(b.id)}
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
    </div>
  );
}
