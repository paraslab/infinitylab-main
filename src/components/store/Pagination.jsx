import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function buildPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((p) => pages.add(p));

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push("ellipsis-" + p);
    result.push(p);
    prev = p;
  }
  return result;
}

export default function Pagination({ page, totalPages, onChange, className = "" }) {
  const pages = useMemo(() => buildPageList(page, totalPages), [page, totalPages]);

  if (totalPages <= 1) return null;

  const go = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange(p);
  };

  const baseBtn =
    "min-w-[40px] h-10 px-3 inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all border";
  const active = "bg-gray-900 text-white border-gray-900 shadow-md";
  const idle = "bg-white border-gray-200 text-gray-600 hover:border-gray-400";
  const disabled = "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed";

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
    >
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className={`${baseBtn} ${page <= 1 ? disabled : idle}`}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) =>
        typeof p === "string" ? (
          <span
            key={p}
            className="min-w-[40px] h-10 inline-flex items-center justify-center text-gray-400 text-sm"
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            className={`${baseBtn} ${p === page ? active : idle}`}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Page ${p}`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        className={`${baseBtn} ${page >= totalPages ? disabled : idle}`}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
