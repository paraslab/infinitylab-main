import React, { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";

export default function AppleSystemMessage({
  title = "Welcome to Laxriq Group",
  message = "Exporting premium solutions to 25+ countries worldwide.",
}) {
  const [state, setState] = useState("hidden");
  // hidden → center → compact → closing

  useEffect(() => {
    const open = setTimeout(() => setState("center"), 2800);
    const compact = setTimeout(() => setState("compact"), 5200);
    const close = setTimeout(() => setState("closing"), 8600);
    const hide = setTimeout(() => setState("hidden"), 9300);

    return () => {
      clearTimeout(open);
      clearTimeout(compact);
      clearTimeout(close);
      clearTimeout(hide);
    };
  }, []);

  if (state === "hidden") return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className={`
          pointer-events-auto absolute left-1/2 -translate-x-1/2
          transition-all duration-[900ms]
          ease-[cubic-bezier(0.16,1,0.3,1)]
          ${state === "center" && "top-1/2 -translate-y-1/2"}
          ${state === "compact" && "top-4 translate-y-0"}
          ${state === "closing" && "top-2"}
        `}
      >
        <div
          className={`
            relative overflow-hidden
            bg-white/70 backdrop-blur-2xl
            border border-gray-200/70
            shadow-[0_40px_90px_rgba(0,0,0,0.18)]
            will-change-transform
            apple-glass apple-grain
            ${state === "center" && "apple-enter apple-float"}
            ${state === "compact" && "apple-compact apple-float apple-breathe"}
            ${state === "closing" && "apple-close"}
            ${state === "center"
              ? "w-[92vw] max-w-xl rounded-3xl px-10 py-9"
              : "w-[92vw] max-w-md rounded-full px-5 py-3"}
          `}
        >
          {/* Close Button (FIXED & WORKING) */}
          <button
            onClick={() => setState("closing")}
            className="
              absolute top-4 right-4 p-2 rounded-full
              hover:bg-black/5
              active:scale-90 active:translate-y-[1px]
              transition-all duration-200
            "
          >
            <HiX className="w-4 h-4 text-gray-600" />
          </button>

          {/* Content */}
          <div className={state === "center" ? "text-center" : "text-left"}>
            <h3
              className={`
                font-semibold text-gray-900
                ${state === "center" ? "text-2xl" : "text-sm"}
                apple-text
              `}
              style={{ animationDelay: "0.06s" }}
            >
              {title}
            </h3>

            <p
              className={`
                text-gray-600
                ${state === "center"
                  ? "text-sm mt-4 opacity-100"
                  : "text-xs mt-0.5 truncate opacity-80"}
                apple-text
              `}
              style={{ animationDelay: "0.14s" }}
            >
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
