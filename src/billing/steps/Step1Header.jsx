import { useEffect, useState } from "react";
import api from "../../api/axiosbill.js";

export default function Step1Header({ setStep, setHeaderId }) {
  const [companies, setCompanies] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [header, setHeader] = useState({
    company_id: "",
    bank_id: "",
    document_type: "quotation",
    document_date: new Date().toISOString().split("T")[0],

    bill_to_name: "",
    bill_to_address: "",
    bill_to_state_code: "",
    bill_to_gst_number: "", // ✅ ADDED

    ship_to_same: true,
    ship_to_name: "",
    ship_to_address: "",
    ship_to_state_code: "",
    ship_to_gst_number: "", // ✅ ADDED

  });

  // ================= FETCH COMPANIES =================
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/api/companies");
      if (res.data?.status) setCompanies(res.data.data);
    } catch (err) {
      console.error("Company fetch error:", err);
    }
  };

  // ================= FETCH BANKS =================
  const fetchBanks = async (companyId) => {
    if (!companyId) {
      setBanks([]);
      return;
    }

    try {
      const res = await api.get("/api/company-banks", {
        params: { company_id: companyId },
      });

      if (res.data?.status) setBanks(res.data.data);
    } catch (error) {
      console.error("Bank fetch error:", error);
    }
  };

  // ================= AUTO COPY BILL -> SHIP =================
  useEffect(() => {
    if (!header.ship_to_same) return;

    setHeader((prev) => ({
      ...prev,
      ship_to_name: prev.bill_to_name,
      ship_to_address: prev.bill_to_address,
      ship_to_state_code: prev.bill_to_state_code,
            ship_to_gst_number: prev.bill_to_gst_number, // ✅ ADDED

    }));
  }, [
    header.ship_to_same,
    header.bill_to_name,
    header.bill_to_address,
    header.bill_to_state_code,
        header.bill_to_gst_number, // ✅ ADDED

  ]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setHeader((prev) => {
      let updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "company_id") {
        updated.bank_id = "";
      }

      return updated;
    });

    if (name === "company_id") {
      fetchBanks(value);
    }
  };

  // ================= CREATE HEADER =================
  const createHeader = async () => {
    try {
      setLoading(true);

      const res = await api.post("/api/billing-headers", header);

      if (res.data?.status) {
        setHeaderId(res.data.data.id);
        setStep(2);
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      console.error("Header error:", err.response?.data);
      alert(err.response?.data?.message || "Validation Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6 space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Step 1: {header.document_type === "invoice" ? "Invoice" : "Quotation"}{" "}
          Header
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Fill details step by step. Inputs auto adjust screen wise.
        </p>
      </div>

      {/* ================= TOP GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Document Type */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Document Type
          </label>
          <select
            name="document_type"
            value={header.document_type}
            onChange={handleChange}
            className="w-full h-11 border border-slate-200 bg-slate-50 px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="quotation">Quotation</option>
            <option value="invoice">Invoice</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Document Date
          </label>
          <input
            type="date"
            name="document_date"
            value={header.document_date}
            onChange={handleChange}
            className="w-full h-11 border border-slate-200 bg-slate-50 px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Company */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Company
          </label>
          <select
            name="company_id"
            value={header.company_id}
            onChange={handleChange}
            className="w-full h-11 border border-slate-200 bg-slate-50 px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.company_name}
              </option>
            ))}
          </select>
        </div>

        {/* Bank */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Bank
          </label>
          <select
            name="bank_id"
            value={header.bank_id}
            onChange={handleChange}
            disabled={!header.company_id}
            className="w-full h-11 border border-slate-200 bg-slate-50 px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-60"
          >
            <option value="">Select Bank</option>
            {banks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.bank_name} - {bank.account_number}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= BILL TO ================= */}
      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">Bill To</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Client Name
            </label>
            <input
              type="text"
              name="bill_to_name"
              value={header.bill_to_name}
              placeholder="Client Name"
              onChange={handleChange}
              className="w-full h-11 border border-slate-200 bg-white px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              State Code
            </label>
            <input
              type="text"
              name="bill_to_state_code"
              value={header.bill_to_state_code}
              placeholder="Ex: 24"
              onChange={handleChange}
              className="w-full h-11 border border-slate-200 bg-white px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
           {/* ✅ BILL TO GST INPUT */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              GST Number
            </label>
            <input
              type="text"
              name="bill_to_gst_number"
              value={header.bill_to_gst_number}
              maxLength={15}
              onChange={handleChange}
              className="w-full h-11 border border-slate-200 bg-white px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Client Address
            </label>
            <textarea
              name="bill_to_address"
              value={header.bill_to_address}
              placeholder="Client Full Address"
              onChange={handleChange}
              rows={3}
              className="w-full border border-slate-200 bg-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* ================= SHIP SAME ================= */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="ship_to_same"
          checked={header.ship_to_same}
          onChange={handleChange}
          className="w-5 h-5 accent-indigo-600"
        />
        <p className="text-sm font-semibold text-slate-700">
          Ship To Same As Bill To
        </p>
      </div>

      {/* ================= SHIP TO ================= */}
      {!header.ship_to_same && (
        <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Ship To</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Ship Name
              </label>
              <input
                type="text"
                name="ship_to_name"
                value={header.ship_to_name}
                placeholder="Ship To Name"
                onChange={handleChange}
                className="w-full h-11 border border-slate-200 bg-slate-50 px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Ship State Code
              </label>
              <input
                type="text"
                name="ship_to_state_code"
                value={header.ship_to_state_code}
                placeholder="Ex: 24"
                onChange={handleChange}
                className="w-full h-11 border border-slate-200 bg-slate-50 px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
                        {/* ✅ SHIP TO GST INPUT */}
            <div>
              <input
                type="text"
                name="ship_to_gst_number"
                value={header.ship_to_gst_number}
                maxLength={15}
                onChange={handleChange}
                className="w-full h-11 border border-slate-200 bg-slate-50 px-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="lg:col-span-3">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Ship Address
              </label>
              <textarea
                name="ship_to_address"
                value={header.ship_to_address}
                placeholder="Ship To Address"
                onChange={handleChange}
                rows={3}
                className="w-full border border-slate-200 bg-slate-50 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBMIT ================= */}
      <button
        onClick={createHeader}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition disabled:opacity-60"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Saving...
          </span>
        ) : (
          "Save & Continue"
        )}
      </button>
    </div>
  );
}
