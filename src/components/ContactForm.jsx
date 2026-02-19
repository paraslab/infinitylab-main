import React, { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ContactForm() {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    country_code: "+91",
    number: "",
    company_name: "",
    website: "",
    message: "",
  });

  // Animate on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShow(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/inquiry", form); // ✅ SAME AS POSTMAN

      toast.success("Inquiry submitted successfully!");
      setForm({
        name: "",
        email: "",
        country_code: "+91",
        number: "",
        company_name: "",
        website: "",
        message: "",
      });
    } catch (err) {
      console.error(err.response?.data);

      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <section className="py-24">
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-900">
          Let’s start a <span className="text-gray-400">conversation</span>
        </h2>
      </div>

      {/* Form Card */}
      <div
        ref={ref}
        className={`
          max-w-4xl mx-auto bg-[#FFFAFA] shadow-2xl rounded-3xl border-dashed
          p-8 md:p-14 transition-all duration-[1200ms]
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        `}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Full name*"
            className="w-full rounded-2xl border border-dashed border-gray-300 px-5 py-3 outline-none focus:border-lime-500"
          />

          {/* Email & Phone */}
          <div className="grid md:grid-cols-2 gap-6">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Email address*"
              className="w-full rounded-2xl border border-dashed border-gray-300 px-5 py-3 outline-none focus:border-lime-500"
            />

            <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] gap-3">
              <input
                name="country_code"
                value={form.country_code}
                onChange={handleChange}
                className="w-24 rounded-2xl border border-dashed border-gray-300 px-4 py-3 outline-none focus:border-lime-500"
              />
              <input
                name="number"
                value={form.number}
                onChange={handleChange}
                required
                placeholder="Phone number*"
                className="flex-1 rounded-2xl border border-dashed border-gray-300 px-5 py-3 outline-none focus:border-lime-500"
              />
            </div>
          </div>

          {/* Company & Website */}
          <div className="grid md:grid-cols-2 gap-6">
            <input
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              placeholder="Company name"
              className="w-full rounded-2xl border border-dashed border-gray-300 px-5 py-3 outline-none focus:border-lime-500"
            />
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="Website (optional)"
              className="w-full rounded-2xl border border-dashed border-gray-300 px-5 py-3 outline-none focus:border-lime-500"
            />
          </div>

          {/* Message */}
          <textarea
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
            placeholder="Your message*"
            className="w-full rounded-2xl border border-dashed border-gray-300 px-5 py-3 resize-none outline-none focus:border-lime-500"
          />

          {/* BUTTON */}
          <div className="flex justify-center md:justify-end">
            <button
              type="submit"
              disabled={loading}
              className="
                w-full md:w-auto
                h-14 md:h-12              /* 🔥 DESKTOP HEIGHT INCREASED */
                px-6 md:px-14
                text-base md:text-base
                bg-[#2F8F6A] hover:bg-lime-900
                text-white font-semibold
                rounded-2xl
                transition
                disabled:opacity-60
                
              "
            >
              {loading ? "Sending..." : "Submit Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
