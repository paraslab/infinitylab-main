import { FiSearch, FiRefreshCcw } from "react-icons/fi";

export default function BillingFilters({
  filters,
  setFilters,
  onApply,
  onReset,
}) {
  const handleChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* Search */}
        <div className="lg:col-span-2">
          <label className="text-xs font-semibold text-slate-600">
            Search
          </label>
          <div className="mt-1 flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50">
            <FiSearch className="text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              placeholder="Search PO / Client..."
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="text-xs font-semibold text-slate-600">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleChange("type", e.target.value)}
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
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-sm"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="final">Final</option>
          </select>
        </div>

        {/* From Date */}
        <div>
          <label className="text-xs font-semibold text-slate-600">
            From Date
          </label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => handleChange("fromDate", e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-sm"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="text-xs font-semibold text-slate-600">
            To Date
          </label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => handleChange("toDate", e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-sm"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:justify-end">
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
        >
          <FiRefreshCcw />
          Reset
        </button>

        <button
          onClick={onApply}
          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
