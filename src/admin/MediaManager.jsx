import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllMedia,
  createMedia,
  updateMediaByKey,
  deleteMedia,
} from "../api/media";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/* ---------------- Skeleton Card ---------------- */
function MediaSkeleton() {
  return (
    <div className="border rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}

export default function MediaManager() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [activeLetter, setActiveLetter] = useState("ALL");

  const fileRef = useRef(null);
  const [form, setForm] = useState({ key: "" });

  const alphabets = ["ALL", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

  /* ---------------- Fetch Media ---------------- */
  const fetchMedia = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const res = await getAllMedia();
      setMedia(res.data?.data?.data || []);
    } catch {
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  /* ---------------- Filtered Media ---------------- */
  const filteredMedia =
    activeLetter === "ALL"
      ? media
      : media.filter((m) =>
          m.key?.toUpperCase().startsWith(activeLetter)
        );

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = fileRef.current?.files?.[0];
    if (!file) return toast.error("Please select an image");
    if (!editItem && !form.key) return toast.error("Media key is required");

    const fd = new FormData();
    fd.append("image", file);
    if (!editItem) fd.append("key", form.key);

    const t = toast.loading(editItem ? "Updating..." : "Uploading...");

    try {
      editItem
        ? await updateMediaByKey(editItem.key, fd)
        : await createMedia(fd);

      toast.success("Media saved", { id: t });
      resetForm();
      fetchMedia(true);
    } catch {
      toast.error("Operation failed", { id: t });
    }
  };

  /* ---------------- Helpers ---------------- */
  const resetForm = () => {
    setForm({ key: "" });
    setEditItem(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({ key: item.key });
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (item) => {
    const t = toast.loading("Deleting...");
    try {
      await deleteMedia(item.id);
      toast.success("Deleted", { id: t });
      fetchMedia(true);
    } catch {
      toast.error("Delete failed", { id: t });
    }
  };

  const copyLink = (imagePath) => {
    navigator.clipboard.writeText(`${BACKEND_URL}/${imagePath}`);
    toast.success("Image URL copied");
  };

  return (
    <div className="space-y-8">
      {/* ---------------- Header ---------------- */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Media Manager</h2>

        <button
          onClick={() => fetchMedia(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-100 transition disabled:opacity-60"
        >
          <span className={refreshing ? "animate-spin" : ""}>⟳</span>
          Refresh
        </button>
      </div>

      {/* ---------------- Form ---------------- */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">
          {editItem ? "Update Media" : "Add New Media"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            value={form.key}
            onChange={(e) => setForm({ key: e.target.value })}
            placeholder="Media key (e.g. home_hero)"
            disabled={!!editItem}
            className="border rounded-lg px-3 py-2 md:col-span-2 disabled:bg-gray-100"
          />

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="border rounded-lg px-3 py-2"
          />

          <button className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700">
            {editItem ? "Update" : "Add"}
          </button>
        </form>

        {editItem && (
          <div className="mt-6 flex gap-6 items-start">
            <img
              src={`${BACKEND_URL}/${editItem.image}`}
              alt={editItem.key}
              className="w-64 h-64 object-cover rounded-xl border"
            />

            <div className="space-y-2">
              <p className="text-sm text-gray-500">Media Key</p>
              <p className="font-semibold">{editItem.key}</p>

              <p className="text-sm text-gray-500 mt-3">Public URL</p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={`${BACKEND_URL}/${editItem.image}`}
                  className="border rounded-lg px-3 py-2 text-sm w-80"
                />
                <button
                  type="button"
                  onClick={() => copyLink(editItem.image)}
                  className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- Alphabet Filter ---------------- */}
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="flex flex-wrap gap-2">
          {alphabets.map((letter) => (
            <button
              key={letter}
              onClick={() => setActiveLetter(letter)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition
                ${
                  activeLetter === letter
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- Media Grid ---------------- */}
      <div className="bg-white rounded-2xl shadow">
        <div className="px-6 py-4 border-b font-semibold">All Media</div>

        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <MediaSkeleton key={i} />
            ))
          ) : filteredMedia.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No media found for "{activeLetter}"
            </p>
          ) : (
            filteredMedia.map((m) => (
              <div
                key={m.id}
                className="group border rounded-2xl overflow-hidden hover:shadow-lg transition"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={`${BACKEND_URL}/${m.image}`}
                    alt={m.key}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <p className="font-semibold truncate">{m.key}</p>

                  <div className="flex justify-between text-sm">
                    <button
                      onClick={() => copyLink(m.image)}
                      className="text-indigo-600 hover:underline"
                    >
                      Copy URL
                    </button>

                    <button
                      onClick={() => handleEdit(m)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
