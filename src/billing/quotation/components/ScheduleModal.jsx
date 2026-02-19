import { useState } from "react";
import api from "../../../api/axiosbill.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ScheduleModal({ record, onClose }) {
     const [scheduleDate, setScheduleDate] = useState(null);
     const [description, setDescription] = useState("");
     const [clientPhone, setClientPhone] = useState(record?.client_phone || "");
     const [clientEmail, setClientEmail] = useState(record?.client_email || "");
     const [loading, setLoading] = useState(false);

     const saveSchedule = async () => {
          if (!scheduleDate) {
               alert("Please select date");
               return;
          }

          if (!clientEmail) {
               alert("Client email is required");
               return;
          }

          try {
               setLoading(true);

               await api.post("/api/billing-schedules", {
                    billing_header_id: record.id,
                    schedule_date: scheduleDate,
                    description,
                    client_phone: clientPhone,
                    client_email: clientEmail,
               });

               alert("Schedule Created Successfully ✅");
               onClose();

          } catch (err) {
               console.error(err);

               if (err.response?.data?.message) {
                    alert(err.response.data.message);
               } else {
                    alert("Error scheduling email");
               }

          } finally {
               setLoading(false);
          }
     };


     return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
               <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 space-y-4">

                    <h2 className="text-lg font-bold text-slate-900">
                         Schedule Email
                    </h2>

                    {/* Date */}
                    <div>
                         <label className="text-sm font-semibold text-slate-600">
                              Select Date
                         </label>
                         <DatePicker
                              selected={scheduleDate}
                              onChange={(date) => setScheduleDate(date)}
                              showTimeSelect
                              dateFormat="Pp"
                              minDate={new Date()}
                              className="mt-1 w-full border rounded-xl px-3 py-2"
                         />
                    </div>

                    {/* Description */}
                    <div>
                         <label className="text-sm font-semibold text-slate-600">
                              Description
                         </label>
                         <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className="mt-1 w-full border rounded-xl px-3 py-2"
                              rows="3"
                              placeholder="Optional message..."
                         />
                    </div>

                    {/* Phone */}
                    <div>
                         <label className="text-sm font-semibold text-slate-600">
                              Client Phone
                         </label>
                         <input
                              type="text"
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              className="mt-1 w-full border rounded-xl px-3 py-2"
                         />
                    </div>

                    {/* Email */}
                    <div>
                         <label className="text-sm font-semibold text-slate-600">
                              Client Email
                         </label>
                         <input
                              type="email"
                              value={clientEmail}
                              onChange={(e) => setClientEmail(e.target.value)}
                              className="mt-1 w-full border rounded-xl px-3 py-2"
                         />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                         <button
                              onClick={onClose}
                              className="px-4 py-2 bg-slate-200 rounded-xl"
                         >
                              Cancel
                         </button>

                         <button
                              onClick={saveSchedule}
                              disabled={loading}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-xl disabled:opacity-50"
                         >
                              {loading ? "Saving..." : "Save"}
                         </button>
                    </div>

               </div>
          </div>
     );
}
