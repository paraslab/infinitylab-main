import React from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ image, title, excerpt, href }) {
  return (
    <Link to={href} className="block">
      <div className="flex flex-col gap-4 group transition-all duration-500">

        {/* Image */}
        <div className="bg-[#FFFAFA] p-3 rounded-3xl overflow-hidden shadow-lg">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={image}
              alt={title}
              className="w-full h-[320px] object-cover transition-all duration-700 group-hover:scale-105 group-hover:blur-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className=" shadow-lg  bg-[#FFFAFA] p-6 rounded-3xl transition-all duration-500 group-hover:bg-[#2F8F6A]">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-[#ffffff]">
            {title}
          </h3>
          <p className="text-sm text-gray-600 group-hover:text-gray-200">
            {excerpt}
          </p>
        </div>

      </div>
    </Link>
  );
}
