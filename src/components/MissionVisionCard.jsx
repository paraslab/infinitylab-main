import React from "react";
import Reveal from "./Reveal";

export default function MissionVisionCard({
  title,
  icon,
  text,
  author,
  image,
  reverse = false,
}) {
  return (
    <section className="w-full py-16 overflow-hidden">
      <div
        className={`max-w-6xl mx-auto flex flex-col ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        } items-stretch gap-8 px-0`}
      >
        {/* Text Card */}
        <Reveal offset={40} duration={900}>
          <div className="relative bg-[#FFFAFA] shadow-xl rounded-3xl p-10 md:p-14 shadow-sm flex-1 h-[400px] flex flex-col justify-center">
            <div className="absolute -top-6 left-8 w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center text-3xl">
              {icon}
            </div>

            <h3 className="mt-6 text-2xl md:text-3xl font-semibold text-gray-900">
              {title}
            </h3>

            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              {text}
            </p>

            {author && (
              <p className="mt-6 text-sm text-gray-500 font-medium">
                {author}
              </p>
            )}
          </div>
        </Reveal>

        {/* Image */}
        <Reveal offset={40} duration={1200} zoom blur>
          <div className="bg-[#FFFAFA] p-3 rounded-3xl overflow-hidden shadow-lg">
          <div className="flex-1 h-[380px]">
            <div className="overflow-hidden rounded-3xl shadow-md h-full">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
