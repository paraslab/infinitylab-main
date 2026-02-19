import { useState } from "react";
import { FiDownload } from "react-icons/fi";

export default function BillingTable({
  records,
  loading,
  onScheduleClick,
}) {
  const [openPdfId, setOpenPdfId] = useState(null);

  const handlePdfClick = (id, layout) => {
    window.open(
      `${import.meta.env.VITE_API_URL2}/api/billing-headers/${id}/pdf?layout=${layout}`,
      "_blank"
    );
    setOpenPdfId(null);
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-xs uppercase text-slate-600">
              <th className="p-4 text-left">No</th>
              <th className="p-4 text-left">Number</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Client</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && records.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center">
                  No Records Found
                </td>
              </tr>
            )}

            {!loading &&
              records.map((r, index) => (
                <tr key={r.id} className="border-t hover:bg-slate-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-semibold">{r.po_number}</td>
                  <td className="p-4 capitalize">{r.document_type}</td>
                  <td className="p-4">{r.bill_to_name}</td>
                  <td className="p-4">{r.document_date}</td>
                  <td className="p-4 font-bold text-indigo-600">
                    ₹ {r.invoice_amount}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        r.status === "final"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="p-4 flex gap-2 relative">

                    {/* 🔥 Schedule Button With Condition */}
                    {r.has_pending_schedule ? (
                      <button
                        disabled
                        className="px-3 py-2 bg-gray-200 text-gray-500 rounded-xl cursor-not-allowed"
                      >
                        ⏳ Scheduled
                      </button>
                    ) : (
                      <button
                        onClick={() => onScheduleClick(r)}
                        className="px-3 py-2 border border-indigo-600 text-indigo-600 bg-white rounded-xl hover:bg-indigo-50 transition"
                      >
                        📅 Schedule
                      </button>
                    )}

                    {/* PDF Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenPdfId(openPdfId === r.id ? null : r.id)
                        }
                        className="px-3 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2"
                      >
                        <FiDownload />
                        PDF
                      </button>

                      {openPdfId === r.id && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                          <button
                            onClick={() =>
                              handlePdfClick(r.id, "single")
                            }
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition"
                          >
                            📄 1 Page PDF
                          </button>

                          <button
                            onClick={() =>
                              handlePdfClick(r.id, "double")
                            }
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition"
                          >
                            📑 2 Page PDF
                          </button>
                        </div>
                      )}
                    </div>

                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
