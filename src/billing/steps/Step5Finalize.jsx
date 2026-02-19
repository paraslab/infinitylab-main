import { useState } from "react";
import api from "../../api/axiosbill.js";
import { FiCheckCircle, FiDownload } from "react-icons/fi";

export default function Step5Finalize({ headerId }) {
  const [loading, setLoading] = useState(false);
  const [finalized, setFinalized] = useState(false);

  const finalize = async () => {
    try {
      setLoading(true);

      await api.post(`/api/billing-headers/${headerId}/finalize`);

      setFinalized(true);
    } catch (err) {
      console.error("Finalize error:", err.response?.data);
      alert(err.response?.data?.message || "Finalize failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (layout) => {
    window.open(
      `${import.meta.env.VITE_API_URL2}/api/billing-headers/${headerId}/pdf?layout=${layout}`,
      "_blank"
    );
  };


  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6 space-y-6">

      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Step 5: Finalize & Download
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Finalize your document and choose PDF layout.
        </p>
      </div>

      {/* Success message */}
      {finalized && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <FiCheckCircle className="text-green-600 mt-0.5" size={18} />
          <div>
            <p className="font-bold text-green-700 text-sm">
              Finalized Successfully!
            </p>
            <p className="text-xs text-green-700/80 mt-1">
              Choose your PDF layout below.
            </p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">

        <button
          onClick={finalize}
          disabled={loading || finalized}
          className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition disabled:opacity-60"
        >
          {loading ? "Finalizing..." : finalized ? "Finalized" : "Finalize"}
        </button>

        {finalized && (
          <>
            <button
              onClick={() => downloadPDF("single")}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition"
            >
              <FiDownload />
              1 Page PDF
            </button>

            <button
              onClick={() => downloadPDF("double")}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition"
            >
              <FiDownload />
              2 Page PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}
