import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, CheckCircle2, ShoppingBag, Mail, MessageCircle,
  CreditCard, Banknote, Smartphone, Truck
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Seo from "../../components/Seo";
import toast from "react-hot-toast";
import { useCart } from "../../store/CartContext";
import storeApi from "../../api/axiosStore";

const WHATSAPP_NUMBER = "918758422048"; // replace with actual number

const fmt = (n) =>
  Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Input({ label, name, value, onChange, error, required, type = "text", placeholder, half }) {
  return (
    <div className={half ? "" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
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

export default function PurchaseOrderPage() {
  const { items, totals, clearCart } = useCart();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
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
    if (items.length === 0) e.cart = "No items in your order";
    return e;
  };

  const buildItemsJson = () =>
    items.map(({ product, qty }) => {
      const price = parseFloat(product.price || 0);
      const gstPct = parseFloat(product.gst_percent || 0);
      const gstAmt = (price * gstPct) / 100;
      return {
        product_id: product.id,
        name: product.name,
        model: product.model || "",
        qty,
        price,
        gst_percent: gstPct,
        gst_amount: gstAmt,
        total: (price + gstAmt) * qty,
      };
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const res = await storeApi.post("/purchase-orders", {
        ...form,
        items_json: buildItemsJson(),
        subtotal: totals.subtotal,
        gst_total: totals.gstTotal,
        grand_total: totals.grandTotal,
      });
      const order = res.data?.data || res.data;
      setSubmitted(order);
      clearCart();
      toast.success("Purchase order placed successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  const sendOrderByWhatsApp = () => {
    const lines = items.map(
      ({ product, qty }) =>
        `• ${product.name}${product.model ? " (" + product.model + ")" : ""} × ${qty}`
    );
    const msg = [
      `*Purchase Order — Infinity Energy*`,
      ``,
      `*Customer:* ${form.first_name} ${form.last_name}`,
      `*Company:* ${form.company}`,
      form.designation ? `*Designation:* ${form.designation}` : "",
      `*Email:* ${form.email}`,
      `*Phone:* ${form.phone}`,
      `*Delivery Address:* ${form.delivery_address}`,
      form.gst_number ? `*GST:* ${form.gst_number}` : "",
      form.pan_number ? `*PAN:* ${form.pan_number}` : "",
      `*Payment Method:* ${form.payment_method.replace("_", " ").toUpperCase()}`,
      ``,
      `*Order Items:*`,
      ...lines,
      ``,
      `*Subtotal (ex-GST): ₹${fmt(totals.subtotal)}*`,
      `*GST: ₹${fmt(totals.gstTotal)}*`,
      `*Grand Total: ₹${fmt(totals.grandTotal)}*`,
      form.notes ? `\n*Notes:* ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const sendOrderByEmail = () => {
    const subject = `Purchase Order — ${form.first_name} ${form.last_name}`;
    const body = items
      .map(({ product, qty }) => `${product.name} × ${qty}`)
      .join(", ");
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
                Order No: <span className="text-gray-900">{submitted.order_no}</span>
              </p>
            )}
            <button
              onClick={() => navigate("/store")}
              className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Continue Shopping
            </button>
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

      <div className="min-h-screen bg-gray-50 pt-6 pb-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <button
            onClick={() => navigate("/store/quotation")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Quotation
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Order</h1>
          <p className="text-gray-500 text-sm mb-8">
            Complete your details to place a purchase order.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* LEFT — Form */}
              <div className="lg:col-span-3 space-y-6">
                {/* Customer Info */}
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

                {/* Payment Method */}
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

                {/* Send Actions */}
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
                      disabled={items.length === 0}
                      className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-40"
                    >
                      <MessageCircle size={15} /> Order via WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT — Order summary */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-6">
                  <h2 className="font-semibold text-gray-900 mb-4 text-lg flex items-center gap-2">
                    <ShoppingBag size={18} /> Order Summary
                  </h2>

                  {errors.cart && (
                    <p className="text-xs text-red-500 mb-3">{errors.cart}</p>
                  )}

                  {items.length === 0 ? (
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
                        {items.map(({ product, qty }) => {
                          const price = parseFloat(product.price || 0);
                          const gst = parseFloat(product.gst_percent || 0);
                          const lineTotal = price * (1 + gst / 100) * qty;
                          return (
                            <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                {product.model && <p className="text-xs text-gray-400">{product.model}</p>}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs text-gray-500">×{qty}</p>
                                <p className="text-sm font-semibold text-gray-900">₹{fmt(lineTotal)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="space-y-2 pt-3 border-t border-gray-100 mb-5">
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Subtotal (ex-GST)</span>
                          <span>₹{fmt(totals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>GST</span>
                          <span>₹{fmt(totals.gstTotal)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                          <span>Total</span>
                          <span>₹{fmt(totals.grandTotal)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || items.length === 0}
                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Placing Order..." : "✅ Place Purchase Order"}
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
