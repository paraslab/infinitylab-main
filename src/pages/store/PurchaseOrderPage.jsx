import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, CheckCircle2, ShoppingBag, Mail, MessageCircle, FileDown,
  CreditCard, Banknote, Smartphone, Truck
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Seo from "../../components/Seo";
import toast from "react-hot-toast";
import { useCart } from "../../store/CartContext";
import storeApi from "../../api/axiosStore";

const WHATSAPP_NUMBER = "918758422048";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Input({ label, name, value, onChange, error, required, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
          error
            ? "border-red-400 focus:ring-red-200"
            : "border-gray-200 focus:ring-gray-200 focus:border-gray-400"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer", icon: Banknote },
  { value: "neft", label: "NEFT", icon: CreditCard },
  { value: "rtgs", label: "RTGS", icon: CreditCard },
  { value: "upi", label: "UPI", icon: Smartphone },
  { value: "cod", label: "COD", icon: Truck },
];

const INITIAL_FORM = {
  first_name: "", last_name: "", company: "", email: "", phone: "",
  designation: "", delivery_address: "", gst_number: "", pan_number: "",
  notes: "", payment_method: "bank_transfer",
};

function splitName(full = "") {
  const parts = full.trim().split(/\s+/);
  return { first_name: parts[0] || "", last_name: parts.slice(1).join(" ") || "" };
}

export default function PurchaseOrderPage() {
  const { items, totals, clearCart, lastQuote, clearLastQuote } = useCart();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const navigate = useNavigate();

  // Prefill from lastQuote (only once on mount)
  useEffect(() => {
    if (lastQuote?.customer) {
      const c = lastQuote.customer;
      const { first_name, last_name } = splitName(c.name || "");
      setForm((f) => ({
        ...f,
        first_name: first_name || f.first_name,
        last_name: last_name || f.last_name,
        company: c.company || f.company,
        email: c.email || f.email,
        phone: c.phone || f.phone,
        delivery_address: c.address || f.delivery_address,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effective items + totals: prefer lastQuote items (authoritative), else cart
  const view = useMemo(() => {
    if (lastQuote?.items?.length) {
      return {
        rows: lastQuote.items.map((it) => ({
          id: it.product_id,
          name: it.product_name,
          model: it.product_model,
          qty: it.qty,
          line_total: it.line_total,
        })),
        subtotal: lastQuote.subtotal,
        gstTotal: lastQuote.gst_total,
        grandTotal: lastQuote.grand_total,
      };
    }
    return {
      rows: items.map(({ product, qty }) => {
        const price = parseFloat(product.price || 0);
        const gst = parseFloat(product.gst_percent || 0);
        return {
          id: product.id,
          name: product.name,
          model: product.model,
          qty,
          line_total: price * (1 + gst / 100) * qty,
        };
      }),
      subtotal: totals.subtotal,
      gstTotal: totals.gstTotal,
      grandTotal: totals.grandTotal,
    };
  }, [lastQuote, items, totals]);

  const isEmpty = view.rows.length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.last_name.trim()) e.last_name = "Required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.delivery_address.trim()) e.delivery_address = "Delivery address required";
    if (isEmpty) e.cart = "No items in your order";
    return e;
  };

  const sessionId = () => localStorage.getItem("infinity_quote_session") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // prevent duplicates
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const payload = { ...form };
      if (lastQuote?.quotation_id) {
        payload.quotation_id = lastQuote.quotation_id;
      } else {
        payload.session_id = sessionId();
      }

      const res = await storeApi.post("/v1/purchase-orders", payload);
      const order = res.data?.data || res.data;
      setSubmitted(order);
      clearCart();
      clearLastQuote();
      toast.success("Purchase order placed successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  const downloadOrderPDF = async () => {
    if (!submitted?.id) return;
    try {
      const res = await storeApi.get(`/v1/purchase-orders/${submitted.id}/download`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Order-${submitted.order_no || submitted.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download order PDF");
    }
  };

  const sendOrderConfirmationWhatsApp = () => {
    const ref = submitted?.order_no || "";
    const total = submitted?.grand_total ?? view.grandTotal;
    const msg = [
      `Hello, I would like to confirm my order.`,
      `Reference: ${ref}`,
      `Total: ₹${fmt(total)}`,
    ].join("\n");
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const sendOrderByWhatsApp = () => {
    const lines = view.rows.map(
      (r) => `• ${r.name}${r.model ? " (" + r.model + ")" : ""} × ${r.qty} — ₹${fmt(r.line_total)}`
    );
    const msg = [
      `*Purchase Order — Infinity Energy*`,
      ``,
      `*Customer:* ${form.first_name} ${form.last_name}`,
      `*Company:* ${form.company}`,
      `*Email:* ${form.email}`,
      `*Phone:* ${form.phone}`,
      `*Delivery Address:* ${form.delivery_address}`,
      lastQuote?.quote_no ? `*Quote Ref:* ${lastQuote.quote_no}` : "",
      ``,
      `*Order Items:*`,
      ...lines,
      ``,
      `*Subtotal: ₹${fmt(view.subtotal)}*`,
      `*GST: ₹${fmt(view.gstTotal)}*`,
      `*Grand Total: ₹${fmt(view.grandTotal)}*`,
    ].filter(Boolean).join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const sendOrderByEmail = () => {
    const subject = `Purchase Order — ${form.first_name} ${form.last_name}`;
    const body = view.rows.map((r) => `${r.name} × ${r.qty}`).join(", ");
    window.location.href = `mailto:sales@infinityenergy.xyz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (submitted) {
    return (
      <>
        <Seo title="Order Placed | Infinity Energy" />
        <Header />
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-green-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
            <p className="text-gray-500 text-sm mb-2">
              Thank you {form.first_name}. We'll confirm your order shortly.
            </p>
            {submitted.order_no && (
              <p className="text-sm font-semibold text-gray-700 mb-6">
                Reference: <span className="text-gray-900">{submitted.order_no}</span>
              </p>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={downloadOrderPDF}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                <FileDown size={16} /> Download Order PDF
              </button>
              <button
                onClick={sendOrderConfirmationWhatsApp}
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={16} /> Send via WhatsApp
              </button>
              <button
                onClick={() => navigate("/store")}
                className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Seo
        title="Purchase Order | Infinity Energy"
        description="Place a purchase order for Infinity Energy products."
      />
      <Header />

      <div className="min-h-screen bg-gray-50 pt-16 pb-16">
        <div className="max-w-6xl mx-auto px-4 pt-16 md:px-8">
          <button
            onClick={() => navigate("/store/quotation")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Quotation
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Order</h1>
          <p className="text-gray-500 text-sm mb-8">
            {lastQuote?.quote_no
              ? `Confirm your order for quote ${lastQuote.quote_no}.`
              : "Complete your details to place a purchase order."}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-5 text-lg">Customer Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="First Name" name="first_name" value={form.first_name} onChange={handleChange} error={errors.first_name} required placeholder="John" />
                    <Input label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} error={errors.last_name} required placeholder="Doe" />
                    <Input label="Company" name="company" value={form.company} onChange={handleChange} error={errors.company} required placeholder="Your Company Ltd." />
                    <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} placeholder="Manager / Director" />
                    <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required placeholder="john@company.com" />
                    <Input label="Phone / WhatsApp" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} required placeholder="+91 98765 43210" />
                    <Input label="GST Number" name="gst_number" value={form.gst_number} onChange={handleChange} placeholder="22AAAAA0000A1Z5" />
                    <Input label="PAN Number" name="pan_number" value={form.pan_number} onChange={handleChange} placeholder="AAAAA0000A" />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="delivery_address"
                      value={form.delivery_address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Street, City, State, PIN"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 resize-none transition-colors ${
                        errors.delivery_address
                          ? "border-red-400 focus:ring-red-200"
                          : "border-gray-200 focus:ring-gray-200"
                      }`}
                    />
                    {errors.delivery_address && (
                      <p className="text-xs text-red-500 mt-1">{errors.delivery_address}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Any special requirements or instructions..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-4 text-lg">Payment Method</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
                      <label
                        key={value}
                        className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                          form.payment_method === value
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-200 hover:border-gray-400 text-gray-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          value={value}
                          checked={form.payment_method === value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <Icon size={15} />
                        <span className="text-sm font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-4 text-lg">Send Order</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={sendOrderByEmail}
                      className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Mail size={15} /> Send by Email
                    </button>
                    <button
                      type="button"
                      onClick={sendOrderByWhatsApp}
                      disabled={isEmpty}
                      className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-40"
                    >
                      <MessageCircle size={15} /> Order via WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-6">
                  <h2 className="font-semibold text-gray-900 mb-4 text-lg flex items-center gap-2">
                    <ShoppingBag size={18} /> Order Summary
                  </h2>

                  {errors.cart && (
                    <p className="text-xs text-red-500 mb-3">{errors.cart}</p>
                  )}

                  {isEmpty ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="mx-auto text-gray-300 mb-3" size={40} />
                      <p className="text-sm text-gray-500 mb-4">No items in your order.</p>
                      <button
                        type="button"
                        onClick={() => navigate("/store")}
                        className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium"
                      >
                        Browse Products
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-5">
                        {view.rows.map((r) => (
                          <div key={r.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                              {r.model && <p className="text-xs text-gray-400">{r.model}</p>}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-xs text-gray-500">×{r.qty}</p>
                              <p className="text-sm font-semibold text-gray-900">₹{fmt(r.line_total)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 pt-3 border-t border-gray-100 mb-5">
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Subtotal (ex-GST)</span>
                          <span>₹{fmt(view.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>GST</span>
                          <span>₹{fmt(view.gstTotal)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                          <span>Total</span>
                          <span>₹{fmt(view.grandTotal)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || isEmpty}
                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Placing Order..." : "Send Order"}
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-3">
                    Our team will confirm your order within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
