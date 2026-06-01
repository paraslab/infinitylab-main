import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SocialFloating from "../components/SocialFloating";
import LayeredLoader from "../components/Loader";
import Seo from "../components/Seo";

const BASE_URL = "https://backend.infinityenergy.xyz";

export default function BlogSingle() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/blogs/${slug}`);
        setBlog(res.data.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // ✅ Convert plain text to HTML
  const formatToHTML = (text) => {
    if (!text) return "";
    const lines = text.split(/\r?\n/);
    let html = "";
    let inList = false;

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("•")) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += `<li>${trimmed.replace("•", "").trim()}</li>`;
      } else if (trimmed === "") {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
      } else {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        html += `<p>${trimmed}</p>`;
      }
    });

    if (inList) html += "</ul>";
    return html;
  };

  if (loading) {
    return (
      <div className="py-32 flex justify-center">
        <LayeredLoader />
      </div>
    );
  }

  if (!blog) {
    return <div className="text-center py-32 text-lg">Blog not found</div>;
  }

  return (
    <>
      <Seo
        title={`${blog.title} | Infinity Energy`}
        description={blog.short_description || blog.title}
        image={blog.image ? `${BASE_URL}/${blog.image}` : undefined}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: blog.title,
          description: blog.short_description || undefined,
          image: blog.image ? `${BASE_URL}/${blog.image}` : undefined,
          datePublished: blog.created_at || undefined,
          dateModified: blog.updated_at || blog.created_at || undefined,
          mainEntityOfPage: `https://www.infinityenergy.xyz/blog/${blog.slug}`,
          author: {
            "@type": "Organization",
            name: "Infinity Energy",
            url: "https://www.infinityenergy.xyz",
          },
          publisher: {
            "@type": "Organization",
            name: "Infinity Energy",
            logo: {
              "@type": "ImageObject",
              url: "https://www.infinityenergy.xyz/favicon.png",
            },
          },
        }}
      />
      <Header />

      <main >
        <section className="max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-24">

          {/* 🔙 Back Button (Top) */}
          <button
            onClick={() => navigate(-1)}
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            ← Back to blogs
          </button>

          {/* 🖼️ Image */}
          <div className="overflow-hidden rounded-[32px] mb-12 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <img
              src={BASE_URL + "/" + blog.image}
              alt={blog.title}
              className="w-full h-[260px] sm:h-[380px] md:h-[460px] object-cover"
            />
          </div>

          {/* 📝 Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            {blog.title}
          </h1>

          {/* 🧾 Short desc */}
          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            {blog.short_description}
          </p>

          {/* 📖 Blog HTML Content */}
          <div
            className="prose prose-lg sm:prose-xl max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{
              __html: formatToHTML(blog.description),
            }}
          />

          {/* 🔙 Back Button (Bottom) */}
          <div className="mt-20 pt-12 border-t border-gray-200">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1F2F25] text-white text-sm font-medium hover:bg-[#2e4638] transition shadow"
            >
              ← Back to blogs
            </button>
          </div>

        </section>
      </main>

      <SocialFloating />
      <Footer />
    </>
  );
}
