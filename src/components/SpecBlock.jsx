import React from "react";

export default function SpecBlock({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className={`
              flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1
              px-4 py-3 rounded-xl
              ${index % 2 === 0 ? "bg-gray-50" : "bg-transparent"}
            `}
          >
            <span className="text-sm text-gray-600 sm:max-w-[70%]">
              {item.parameter}
            </span>

            <span className="text-sm font-semibold text-gray-900 sm:text-right">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
