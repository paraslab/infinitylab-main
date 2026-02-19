import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function QuotationList() {
  const [quotations, setQuotations] = useState([]);
  const navigate = useNavigate();

  const fetchQuotations = async () => {
    try {
      const res = await api.get("/api/billing-headers?document_type=quotation");

      if (res.data.status) {
        setQuotations(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching quotations:", err);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quotation?")) return;

    try {
      await api.delete(`/api/billing-headers/${id}`);
      fetchQuotations();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quotation List</h1>

        <button
          onClick={() => navigate("/billing/quotation/create")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
        >
          + Create Quotation
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">No</th>
              <th className="p-4 text-left">Quotation No</th>
              <th className="p-4 text-left">Client</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Basic</th>
              <th className="p-4 text-left">GST</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {quotations.map((q, index) => (
              <tr key={q.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4 font-medium">{q.po_number}</td>
                <td className="p-4">{q.bill_to_name}</td>
                <td className="p-4">{q.document_date}</td>
                <td className="p-4">₹ {q.basic_value}</td>
                <td className="p-4">₹ {q.total_gst}</td>
                <td className="p-4 font-semibold text-indigo-600">
                  ₹ {q.invoice_amount}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      q.status === "final"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {q.status}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/billing/quotation/edit/${q.id}`)
                    }
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(q.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() =>
                      window.open(
                        `${import.meta.env.VITE_API_URL}/api/billing-headers/${q.id}/pdf`,
                        "_blank"
                      )
                    }
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
