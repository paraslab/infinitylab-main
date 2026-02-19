import React from "react";
import { useParams } from "react-router-dom";
import SocialFloating from "../components/SocialFloating";

const blogs = [
  {
    slug: "eco-friendly-bagasse",
    title: "Eco Friendly Bagasse",
    image: "https://via.placeholder.com/1200x600",
    content:
      "Full blog content goes here... You can fetch from API also.",
  },
  {
    slug: "sustainable-packaging",
    title: "Sustainable Packaging",
    image: "https://via.placeholder.com/1200x600",
    content: "Another blog full content...",
  },
];

export default function SingleBlog() {
  const { slug } = useParams();

  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) return <div className="p-10">Blog not found</div>;

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-[420px] object-cover rounded-3xl mb-8"
      />
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-600 leading-relaxed">{blog.content}</p>
    </section>
    
  );
}
