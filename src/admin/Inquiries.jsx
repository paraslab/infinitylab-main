import React, { useEffect, useState, useRef } from "react";
import api from "../api/axios";

export default function Inquiries() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get("/inquiries");
      setList(res.data?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch inquiries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchInquiries();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6">
        Customer Inquiries
      </h2>

      {loading && <p>Loading...</p>}

      {!loading && list.length === 0 && (
        <p className="text-gray-500">No inquiries found.</p>
      )}

      {!loading && list.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((i) => (
            <div
              key={i.id}
              className="border rounded-xl p-5 bg-gray-50 hover:shadow transition"
            >
              {/* Header */}
              <div className="mb-3">
                <h3 className="font-semibold text-lg">
                  {i.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {i.email}
                </p>
              </div>

              {/* Contact */}
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {i.country_code} {i.number}
                </p>

                {i.company_name && (
                  <p>
                    <span className="font-medium">Company:</span>{" "}
                    {i.company_name}
                  </p>
                )}

                {i.website && (
                  <p>
                    <span className="font-medium">Website:</span>{" "}
                    <a
                      href={i.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {i.website}
                    </a>
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="mt-4 bg-white p-3 rounded-lg border">
                <p className="text-gray-800 text-sm">
                  {i.message}
                </p>
              </div>

              {/* Date */}
              <p className="text-xs text-gray-400 mt-3">
                Submitted on{" "}
                {new Date(i.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
