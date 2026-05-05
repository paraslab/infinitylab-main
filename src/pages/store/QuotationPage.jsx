import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2, Plus, Minus, ShoppingBag, FileDown, MessageCircle,
  ArrowRight, ChevronLeft, CheckCircle2
} from "lucide-react";
import jsPDF from "jspdf";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Seo from "../../components/Seo";
import toast from "react-hot-toast";
import { useCart } from "../../store/CartContext";
import storeApi from "../../api/axiosStore";

const WHATSAPP_NUMBER = "918758422048"; // replace with actual number

const SESSION_KEY = "infinity_quote_session";
function getSessionId() {
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid || sid.length < 8) {
    sid = "sess_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

const fmt = (n) =>
  Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Input({ label, name, value, onChange, error, required, type = "text", placeholder }) {
  return (
    <div>
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

const INITIAL_FORM = {
  name: "", company: "", email: "", phone: "", address: ""
};

export default function QuotationPage() {
  const { items, updateQty, removeItem, totals, clearCart, setLastQuote } = useCart();
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
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (items.length === 0) e.cart = "Add at least one product";
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
      const session_id = getSessionId();

      await storeApi.delete("/v1/quote-cart", { params: { session_id } }).catch(() => {});
      for (const { product, qty } of items) {
        await storeApi.post("/v1/quote-cart", {
          session_id,
          product_id: product.id,
          qty,
        });
      }

      const res = await storeApi.post("/v1/quotations", {
        session_id,
        ...form,
      });
      const quote = res.data?.data || res.data;
      setSubmitted(quote);
      setLastQuote({
        quotation_id: quote.id,
        quote_no: quote.quote_no,
        customer: { ...form },
        items: quote.items || [],
        subtotal: quote.subtotal ?? totals.subtotal,
        gst_total: quote.gst_total ?? totals.gstTotal,
        grand_total: quote.grand_total ?? totals.grandTotal,
        pdf_url: quote.pdf_url || null,
      });
      toast.success("Quotation submitted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit quotation");
    } finally {
      setSubmitting(false);
    }
  };

  const downloadServerPDF = async () => {
    if (!submitted?.id) {
      toast.error("Submit the quotation first to download the official PDF.");
      return;
    }
    try {
      const res = await storeApi.get(`/v1/quotations/${submitted.id}/download`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Quotation-${submitted.quote_no || submitted.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (submitted.pdf_url) {
        window.open(submitted.pdf_url, "_blank");
      } else {
        toast.error("Failed to download PDF");
      }
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("QUOTATION", 105, y, { align: "center" });
    y += 14;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 14, y); y += 7;
    doc.text(`To: ${form.name}`, 14, y); y += 7;
    if (form.company) { doc.text(`Company: ${form.company}`, 14, y); y += 7; }
    doc.text(`Email: ${form.email}   Phone: ${form.phone}`, 14, y); y += 7;
    doc.text(`Address: ${form.address}`, 14, y); y += 10;

    // Table header
    doc.setFont("helvetica", "bold");
    doc.setFillColor(30, 30, 30);
    doc.rect(14, y - 4, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Product", 16, y);
    doc.text("Model", 90, y);
    doc.text("Qty", 125, y);
    doc.text("Unit Price", 138, y);
    doc.text("Total", 172, y);
    doc.setTextColor(0, 0, 0);
    y += 7;

    doc.setFont("helvetica", "normal");
    items.forEach(({ product, qty }) => {
      const price = parseFloat(product.price || 0);
      const gstPct = parseFloat(product.gst_percent || 0);
      const total = price * (1 + gstPct / 100) * qty;
      doc.text(product.name.substring(0, 40), 16, y);
      doc.text(product.model || "-", 90, y);
      doc.text(String(qty), 128, y);
      doc.text(`Rs.${fmt(price)}`, 138, y);
      doc.text(`Rs.${fmt(total)}`, 172, y);
      y += 7;
      if (y > 260) { doc.addPage(); y = 20; }
    });

    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Subtotal (ex-GST): Rs.${fmt(totals.subtotal)}`, 130, y); y += 7;
    doc.text(`GST Total: Rs.${fmt(totals.gstTotal)}`, 130, y); y += 7;
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: Rs.${fmt(totals.grandTotal)}`, 130, y);

    doc.save(`Quotation-${form.name}-${Date.now()}.pdf`);
  };

  const sendWhatsApp = () => {
    const q = submitted || {};
    const quoteItems = q.items || items.map(({ product, qty }) => ({
      product_name: product.name,
      product_model: product.model || "",
      qty,
      unit_price: parseFloat(product.price || 0),
      gst_percent: parseFloat(product.gst_percent || 0),
      line_gst: (parseFloat(product.price || 0) * parseFloat(product.gst_percent || 0) / 100) * qty,
      line_total: parseFloat(product.price || 0) * (1 + parseFloat(product.gst_percent || 0) / 100) * qty,
    }));

    const itemLines = quoteItems.map(
      (it, i) =>
        `${i + 1}. *${it.product_name}*${it.product_model ? ` (${it.product_model})` : ""}` +
        `\n   Qty: ${it.qty} × ₹${fmt(it.unit_price)} | GST ${it.gst_percent}%: ₹${fmt(it.line_gst)}` +
        `\n   Line Total: *₹${fmt(it.line_total)}*`
    );

    const sub = q.subtotal ?? totals.subtotal;
    const gst = q.gst_total ?? totals.gstTotal;
    const grand = q.grand_total ?? totals.grandTotal;

    const msg = [
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🔋 *INFINITY ENERGY*`,
      `📄 Commercial Quotation`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      q.quote_no ? `*Quote Ref:* ${q.quote_no}` : `*Quote Request*`,
      `*Date:* ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`,
      `*Valid Until:* ${new Date(Date.now() + 30 * 86400000).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`,
      ``,
      `👤 *Customer Details*`,
      `Name: ${form.name}`,
      form.company ? `Company: ${form.company}` : "",
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      form.address ? `Address: ${form.address}` : "",
      ``,
      `📦 *Quoted Products*`,
      `──────────────────────────`,
      ...itemLines,
      `──────────────────────────`,
      ``,
      `💰 *Price Summary*`,
      `Subtotal (ex-GST): ₹${fmt(sub)}`,
      `Total GST: ₹${fmt(gst)}`,
      `*Grand Total: ₹${fmt(grand)}*`,
      ``,
      `📋 *Terms*`,
      `• Valid for 30 days from date above`,
      `• Delivery: 7–14 working days after PO`,
      `• Payment: Advance as agreed`,
      `• GST as per applicable slab rates`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `To place your order, please reply here`,
      `or email: sales@infinityenergy.xyz`,
      `🌐 www.infinityenergy.xyz`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
    ]
      .filter((l) => l !== undefined && l !== null)
      .join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  if (submitted) {
    return (
      <>
        <Seo title="Quotation Submitted | Infinity Energy" />
        <Header />
        <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-gray-50">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-green-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Submitted!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Thank you {form.name}. We'll get back to you shortly.
            </p>
            {submitted.quote_no && (
              <p className="text-sm font-semibold text-gray-700 mb-6">
                Reference: <span className="text-gray-900">{submitted.quote_no}</span>
              </p>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={downloadServerPDF}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                <FileDown size={16} /> Download PDF Quote
              </button>
              <button
                onClick={sendWhatsApp}
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={16} /> Send via WhatsApp
              </button>
              <button
                onClick={() => navigate("/store/order")}
                className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Place Purchase Order <ArrowRight size={16} />
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
        title="Get a Quotation | Infinity Energy"
        description="Request a quotation for Infinity Energy products."
      />
      <Header />

      <div className="min-h-screen bg-gray-50 pt-16 pb-16">
        <div className="max-w-6xl mx-auto px-4 pt-16 md:px-8">
          {/* Back */}
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Products
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request a Quotation</h1>
          <p className="text-gray-500 text-sm mb-8">
            Fill in your details and review your quote before submitting.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* LEFT — Customer form */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-5 text-lg">Customer Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} required placeholder="John Doe" />
                    <Input label="Company / Organization" name="company" value={form.company} onChange={handleChange} placeholder="Your Company Ltd." />
                    <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required placeholder="john@company.com" />
                    <Input label="Phone / WhatsApp" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} required placeholder="+91 98765 43210" />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Street, City, State, PIN"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors resize-none ${
                        errors.address
                          ? "border-red-400 focus:ring-red-200"
                          : "border-gray-200 focus:ring-gray-200 focus:border-gray-400"
                      }`}
                    />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>
                </div>
              </div>

              {/* RIGHT — Cart + Summary */}
              <div className="lg:col-span-2 space-y-5">
                {/* Cart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-6">
                  <h2 className="font-semibold text-gray-900 mb-4 text-lg flex items-center gap-2">
                    <ShoppingBag size={18} />
                    Quote Summary
                  </h2>

                  {errors.cart && (
                    <p className="text-xs text-red-500 mb-3">{errors.cart}</p>
                  )}

                  {items.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="mx-auto text-gray-300 mb-3" size={40} />
                      <p className="text-sm text-gray-500 mb-4">Your quote is empty</p>
                      <button
                        type="button"
                        onClick={() => navigate("/store")}
                        className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium"
                      >
                        Browse Products
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-5">
                      {items.map(({ product, qty }) => {
                        const price = parseFloat(product.price || 0);
                        const gst = parseFloat(product.gst_percent || 0);
                        const lineTotal = price * (1 + gst / 100) * qty;
                        return (
                          <div key={product.id} className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                              {product.model && <p className="text-xs text-gray-400">{product.model}</p>}
                              <p className="text-xs text-gray-500 mt-0.5">
                                ₹{fmt(lineTotal)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateQty(product.id, qty - 1)}
                                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                              <button
                                type="button"
                                onClick={() => updateQty(product.id, qty + 1)}
                                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeItem(product.id)}
                                className="w-7 h-7 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors ml-1"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Totals */}
                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal (ex-GST)</span>
                      <span>₹{fmt(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>GST</span>
                      <span>₹{fmt(totals.gstTotal)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Grand Total</span>
                      <span>₹{fmt(totals.grandTotal)}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-5 space-y-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Submitting..." : "Submit Quotation"}
                    </button>
                    <div className="grid grid-cols-1 gap-2">
                      {/* <button
                        type="button"
                        onClick={downloadPDF}
                        disabled={items.length === 0}
                        className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
                      >
                        <FileDown size={14} /> PDF
                      </button> */}
                      <button
                        type="button"
                        onClick={sendWhatsApp}
                        disabled={items.length === 0}
                        className="flex items-center justify-center gap-1.5 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-40"
                      >
                        <MessageCircle size={12} /> WhatsApp
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/store/order")}
                      disabled={items.length === 0}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
                    >
                      Place Purchase Order <ArrowRight size={14} />
                    </button>
                  </div>
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
