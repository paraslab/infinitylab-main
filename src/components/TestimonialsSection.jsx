import React, { useEffect, useState, useRef } from "react";
import CircularTestimonials from "./CircularTestimonials";
import api from "../api/axios";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchTestimonials() {
      try {
        const res = await api.get("/testimonials");
        const apiData = res.data?.data?.data || [];

        const mapped = apiData.map((item) => ({
          name: item.name,
          designation: item.designation,
          quote: item.message,
          src: item.image
            ? item.image.startsWith("http")
              ? item.image
              : `https://backend.infinityenergy.xyz/${item.image}`
            : "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg",
        }));

        setTestimonials(mapped);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading testimonials...</p>;
  }

  if (!testimonials.length) {
    return <p className="text-center py-10">No testimonials found.</p>;
  }

  return (
    <section className="relative py-24 flex justify-center overflow-hidden from-slate-50 via-white to-slate-100">
      <CircularTestimonials
        testimonials={testimonials}
        autoplay
        colors={{
          name: "#0a0a0a",
          designation: "#525252",
          testimony: "#171717",
          arrowBackground: "#2F8F6A",
          arrowForeground: "#f1f1f7",
          arrowHoverBackground: "#1e5c44ff",
        }}
        fontSizes={{
          name: "1.5rem",
          designation: "1rem",
          quote: "1.1rem",
        }}
      />
    </section>
  );
}
