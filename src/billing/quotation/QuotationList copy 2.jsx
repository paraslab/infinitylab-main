import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  FiSearch,
  FiRefreshCcw,
  FiDownload,
  FiEye,
  FiPlus,
} from "react-icons/fi";

export default function BillingList() {
  const [records, setRecords] = useState([]);

  // filters
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  // ui states
  const [loading, setLoading] = useState(false);
  const [openPdfId, setOpenPdfId] = useState(null);

  const navigate = useNavigate();

  const fetchRecords = async () => {
    try {
      setLoading(true);

      let params = {};

      if (type) params.document_type = type;
      if (status) params.status = status;

      if (fromDate) params.from_date = fromDate;
      if (toDate) params.to_date = toDate;

      if (search) params.search = search;

      const res = await api.get("/api/billing-headers", { params });

      if (res.data.status) {
        setRecords(res.data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const resetFilters = () => {
    setType("");
    setStatus("");
    setFromDate("");
    setToDate("");
    setSearch("");
    fetchRecords();
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing List</h1>
          <p className="text-sm text-slate-500">
            Manage quotations & invoices with filters and PDF downloads.
          </p>
        </div>

        <button
          onClick={() => navigate("/billing/quotation/create")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
        >
          + Create Quotation
        </button>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-slate-600">
              Search
            </label>
            <div className="mt-1 flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50">
              <FiSearch className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search PO / Client..."
                className="w-full bg-transparent outline-none text-sm text-slate-700"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-semibold text-slate-600">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-sm"
            >
              <option value="">All Type</option>
              <option value="quotation">Quotation</option>
              <option value="invoice">Invoice</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-slate-600">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-sm"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="final">Final</option>
            </select>
          </div>

          {/* From */}
          <div>
            <label className="text-xs font-semibold text-slate-600">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-sm"
            />
          </div>

          {/* To */}
          <div>
            <label className="text-xs font-semibold text-slate-600">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-sm"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
          <button
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
          >
            <FiRefreshCcw />
            Reset
          </button>

          <button
            onClick={fetchRecords}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Top small info bar */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Total Records:{" "}
            <span className="font-bold text-slate-900">{records.length}</span>
          </p>

          {loading && (
            <span className="text-sm font-semibold text-indigo-600">
              Loading...
            </span>
          )}
        </div>

        {/* Scroll container */}
        <div className="w-full overflow-x-auto">
          <div className="max-h-[70vh] overflow-y-auto">
            <table className="min-w-[1100px] w-full text-sm">
              <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                <tr className="text-slate-600 text-xs uppercase tracking-wider">
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
                {/* Loading Skeleton */}
                {loading && (
                  <>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="border-t">
                        <td className="p-4" colSpan={8}>
                          <div className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}

                {/* Empty State */}
                {!loading && records.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-10 text-center">
                      <p className="text-lg font-bold text-slate-800">
                        No records found
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Try changing filters or reset.
                      </p>
                    </td>
                  </tr>
                )}

                {/* Records */}
                {!loading &&
                  records.map((r, index) => (
                    <tr
                      key={r.id}
                      className="border-t hover:bg-slate-50 transition"
                    >
                      <td className="p-4 text-slate-700">{index + 1}</td>

                      <td className="p-4 font-semibold text-slate-900">
                        {r.po_number}
                      </td>

                      <td className="p-4 capitalize">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                          {r.document_type}
                        </span>
                      </td>

                      <td className="p-4 text-slate-700">{r.bill_to_name}</td>

                      <td className="p-4 text-slate-700">{r.document_date}</td>

                      <td className="p-4 font-bold text-indigo-600">
                        ₹ {r.invoice_amount}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${r.status === "final"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 relative">

                          {/* View */}
                          <button
                            onClick={() =>
                              navigate(`/billing/view/${r.id}`)
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition"
                          >
                            <FiEye />
                            View
                          </button>

                          {/* PDF */}
                          {/* PDF Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenPdfId(openPdfId === r.id ? null : r.id)
                              }
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                            >
                              <FiDownload />
                              PDF
                            </button>

                            {openPdfId === r.id && (
                              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">

                                <button
                                  onClick={() => {
                                    window.open(
                                      `${import.meta.env.VITE_API_URL}/api/billing-headers/${r.id}/pdf?layout=single`,
                                      "_blank"
                                    );
                                    setOpenPdfId(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition"
                                >
                                  📄 1 Page PDF
                                </button>

                                <button
                                  onClick={() => {
                                    window.open(
                                      `${import.meta.env.VITE_API_URL}/api/billing-headers/${r.id}/pdf?layout=double`,
                                      "_blank"
                                    );
                                    setOpenPdfId(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition"
                                >
                                  📑 2 Page PDF
                                </button>

                              </div>
                            )}
                          </div>

                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
