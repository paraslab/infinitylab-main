import { useState } from "react";
import api from "../../api/axiosbill.js";
import { FiArrowRight } from "react-icons/fi";

export default function Step4Footer({ headerId, setStep }) {
  const [loading, setLoading] = useState(false);

  const [footer, setFooter] = useState({
    delivery_note: "",
    delivery_place: "",
    payment_terms: "",
    warranty_note: "",
    gst_note: "",
    terms_conditions: "",
    authorized_sign: "",
    jurisdiction: "",
  });

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFooter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= UPDATE FOOTER =================
  const updateFooter = async () => {
    try {
      setLoading(true);

      await api.put(`/api/billing-headers/${headerId}/footer`, footer);

      setStep(5);
    } catch (error) {
      console.error("Footer update error:", error.response?.data);
      alert("Footer Save Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6 space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Step 4: Footer Details
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Add delivery, warranty, GST notes and terms.
        </p>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Delivery Note">
          <input
            type="text"
            name="delivery_note"
            placeholder="Ex: Delivery within 7 days"
            value={footer.delivery_note}
            onChange={handleChange}
            className="w-full h-11 border border-slate-200 bg-slate-50 px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </Field>

        <Field label="Delivery Place">
          <input
            type="text"
            name="delivery_place"
            placeholder="Ex: Ahmedabad"
            value={footer.delivery_place}
            onChange={handleChange}
            className="w-full h-11 border border-slate-200 bg-slate-50 px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </Field>

        <Field label="Payment Terms">
          <input
            type="text"
            name="payment_terms"
            placeholder="Ex: 50% advance, 50% on delivery"
            value={footer.payment_terms}
            onChange={handleChange}
            className="w-full h-11 border border-slate-200 bg-slate-50 px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </Field>

        <Field label="Warranty Note">
          <input
            type="text"
            name="warranty_note"
            placeholder="Ex: 1 year warranty"
            value={footer.warranty_note}
            onChange={handleChange}
            className="w-full h-11 border border-slate-200 bg-slate-50 px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </Field>

        <Field label="GST Note">
          <input
            type="text"
            name="gst_note"
            placeholder="Ex: GST included as applicable"
            value={footer.gst_note}
            onChange={handleChange}
            className="w-full h-11 border border-slate-200 bg-slate-50 px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </Field>

        <Field label="Jurisdiction">
          <input
            type="text"
            name="jurisdiction"
            placeholder="Ex: Surat"
            value={footer.jurisdiction}
            onChange={handleChange}
            className="w-full h-11 border border-slate-200 bg-slate-50 px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </Field>
      </div>

      {/* Terms */}
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1">
          Terms & Conditions
        </label>
        <textarea
          name="terms_conditions"
          placeholder="Enter terms & conditions..."
          value={footer.terms_conditions}
          onChange={handleChange}
          rows={4}
          className="w-full border border-slate-200 bg-slate-50 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      {/* Authorized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Authorized Sign">
          <input
            type="text"
            name="authorized_sign"
            placeholder="Ex: Infinity Energy"
            value={footer.authorized_sign}
            onChange={handleChange}
            className="w-full h-11 border border-slate-200 bg-slate-50 px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </Field>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={updateFooter}
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
              Save & Continue <FiArrowRight />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ================= SMALL FIELD COMPONENT ================= */
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
