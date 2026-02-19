import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosbill.js";
import BillingTable from "./components/BillingTable";
import ScheduleModal from "./components/ScheduleModal";
import BillingFilters from "./components/BillingFilters";

export default function BillingList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
    fromDate: "",
    toDate: "",
  });

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const navigate = useNavigate();

  const fetchRecords = async () => {
    try {
      setLoading(true);

      let params = {};

      if (filters.search) params.search = filters.search;
      if (filters.type) params.document_type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.fromDate) params.from_date = filters.fromDate;
      if (filters.toDate) params.to_date = filters.toDate;

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
    setFilters({
      search: "",
      type: "",
      status: "",
      fromDate: "",
      toDate: "",
    });

    fetchRecords();
  };

  const openSchedulePopup = (record) => {
    setSelectedRecord(record);
    setShowScheduleModal(true);
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Billing List
          </h1>
          <p className="text-sm text-slate-500">
            Manage quotations & invoices easily.
          </p>
        </div>

        {/* ✅ Create Button (Kept Safe 😄) */}
        <button
          onClick={() => navigate("/billing/quotation/create")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-sm transition"
        >
          + Create Quotation
        </button>
      </div>

      {/* ================= FILTERS ================= */}
      <BillingFilters
        filters={filters}
        setFilters={setFilters}
        onApply={fetchRecords}
        onReset={resetFilters}
      />

      {/* ================= TABLE ================= */}
      <BillingTable
        records={records}
        loading={loading}
        onScheduleClick={openSchedulePopup}
      />

      {/* ================= MODAL ================= */}
      {showScheduleModal && (
        <ScheduleModal
          record={selectedRecord}
          onClose={() => setShowScheduleModal(false)}
        />
      )}

    </div>
  );
}
