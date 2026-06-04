import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RevealSection from "../components/RevealSection";
import BlogCard from "../components/BlogCard";
import SocialFloating from "../components/SocialFloating";
import LayeredLoader from "../components/Loader";
import Seo from "../components/Seo";

const BASE_URL = "https://backend.infinityenergy.xyz"; // your backend

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/blogs`);
        setBlogs(res.data.data.data); // pagination → data.data
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <Seo
        title="Energy Storage Blog | Insights & Articles - Infinity Energy"
        description="Read Infinity Energy's latest articles on lithium batteries, solar storage, BESS, and clean energy solutions for homes and businesses in India."
      />
      <Header />

      <main className="pt-0 px-4 md:px-4 space-y-8">
        {/* Hero */}
        <section>
          <RevealSection
            image="https://backend.infinityenergy.xyz/uploads/media/blog_hero.webp"
            title="Welcome to Our Blog"
            subtitle=""
            height="h-[600px] sm:h-[300px] md:h-[400px] lg:h-[550px]"
          />
        </section>

        {/* Blog Cards */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          {loading ? (
            <div className="py-32 flex justify-center">
              <LayeredLoader />
            </div>
          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  image={BASE_URL + "/" + blog.image}
                  title={blog.title}
                  excerpt={blog.short_description}
                  href={`/blog/${blog.slug}`}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <SocialFloating />

      <Footer />
    </>
  );
}
