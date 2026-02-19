import { useState } from "react";
import api from "../../api/axiosbill.js";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

export default function Step3Calculate({ headerId, setStep }) {
  const [loading, setLoading] = useState(false);

  const calculateTotals = async () => {
    try {
      setLoading(true);

      const res = await api.post(`/api/billing-headers/${headerId}/calculate`);

      console.log("Calculation Response:", res.data);

      setStep(4);
    } catch (error) {
      console.error("Calculation Error:", error.response?.data);
      alert(error.response?.data?.message || "Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6 space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Step 3: Calculate Totals
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          This will calculate subtotal, GST/IGST, and final total amount.
        </p>
      </div>

      {/* Info box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FiCheckCircle className="text-green-600 mt-0.5" size={18} />
          <div>
            <p className="font-semibold text-slate-900 text-sm">
              Ready to calculate totals
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Make sure all items are added correctly before continuing.
            </p>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <button
          onClick={calculateTotals}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Calculating...
            </>
          ) : (
            <>
              Calculate & Continue <FiArrowRight />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
