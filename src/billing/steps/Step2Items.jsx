import { useState } from "react";
import api from "../../api/axiosbill.js";
import { FiPlus, FiTrash2, FiArrowRight } from "react-icons/fi";

export default function Step2Items({ headerId, setStep }) {
  const [items, setItems] = useState([
    { item_name: "", qty: "", price: "", gst_rate: "", igst_rate: "" },
  ]);

  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    // If IGST entered → clear GST
    if (field === "igst_rate" && value !== "") {
      updated[index]["gst_rate"] = "";
    }

    // If GST entered → clear IGST
    if (field === "gst_rate" && value !== "") {
      updated[index]["igst_rate"] = "";
    }

    setItems(updated);
  };

  const addRow = () => {
    setItems([
      ...items,
      { item_name: "", qty: "", price: "", gst_rate: "", igst_rate: "" },
    ]);
  };

  const removeRow = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const saveItems = async () => {
    try {
      setLoading(true);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // skip empty
        if (!item.item_name && !item.qty && !item.price) continue;

        // validate
        if (!item.item_name || !item.qty || !item.price) {
          alert(`Please complete row ${i + 1}`);
          setLoading(false);
          return;
        }

        await api.post("/api/billing-items", {
          billing_header_id: headerId,
          sr_no: i + 1,
          description: item.item_name,
          qty: Number(item.qty),
          price: Number(item.price),
          gst_rate: item.gst_rate ? Number(item.gst_rate) : null,
          igst_rate: item.igst_rate ? Number(item.igst_rate) : null,
        });
      }

      setStep(3);
    } catch (error) {
      console.error(error.response?.data);
      alert("Item Save Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6 space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Step 2: Add Billing Items
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter product details and tax structure (GST or IGST)
        </p>
      </div>

      {/* Desktop Table Header */}
      <div className="hidden lg:grid grid-cols-12 gap-3 px-3 text-xs font-bold text-slate-600 uppercase">
        <div className="col-span-4">Item</div>
        <div className="col-span-2">Qty</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">GST %</div>
        <div className="col-span-1">IGST %</div>
        <div className="col-span-1 text-right">Remove</div>
      </div>

      {/* Rows */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-xl p-4 bg-slate-50"
          >
            {/* Row Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              {/* Item name */}
              <div className="lg:col-span-4">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="Ex: Solar Panel Installation"
                  value={item.item_name}
                  onChange={(e) =>
                    handleChange(index, "item_name", e.target.value)
                  }
                  className="w-full h-11 border border-slate-200 rounded-lg px-3 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Qty */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Qty
                </label>
                <input
                  type="number"
                  placeholder="1"
                  value={item.qty}
                  onChange={(e) => handleChange(index, "qty", e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-lg px-3 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Price */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  value={item.price}
                  onChange={(e) => handleChange(index, "price", e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-lg px-3 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* GST */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  GST %
                </label>
                <input
                  type="number"
                  placeholder="18"
                  value={item.gst_rate}
                  disabled={item.igst_rate !== ""}
                  onChange={(e) =>
                    handleChange(index, "gst_rate", e.target.value)
                  }
                  className="w-full h-11 border border-slate-200 rounded-lg px-3 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                />
              </div>

              {/* IGST */}
              <div className="lg:col-span-1">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  IGST %
                </label>
                <input
                  type="number"
                  placeholder="18"
                  value={item.igst_rate}
                  disabled={item.gst_rate !== ""}
                  onChange={(e) =>
                    handleChange(index, "igst_rate", e.target.value)
                  }
                  className="w-full h-11 border border-slate-200 rounded-lg px-3 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                />
              </div>

              {/* Remove */}
              <div className="lg:col-span-1 flex justify-end">
                <button
                  onClick={() => removeRow(index)}
                  className="h-11 w-11 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition"
                  title="Remove Row"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <button
          onClick={addRow}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition"
        >
          <FiPlus />
          Add Row
        </button>

        <button
          onClick={saveItems}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Saving...
            </>
          ) : (
            <>
              Save Items & Continue <FiArrowRight />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
