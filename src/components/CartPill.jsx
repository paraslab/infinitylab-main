import React from "react";
import { FaShoppingCart } from "react-icons/fa";

/**
 * CartPill
 * ─────────────────────────────────────────────
 * Props:
 *   href       – destination URL  (default "/cart")
 *   cartCount  – number to show in badge  (default 0)
 *   visible    – synced with SocialFloating scroll state
 *
 * Renders two independent pieces:
 *   • Desktop → glass pill (same DNA as WhatsApp pill)
 *   • Mobile  → floating circular badge above the dock
 */
/**
 * variant:
 *   "desktop" → renders only the glass pill (used inside the right desktop column)
 *   "mobile"  → renders only the floating orange circle (used standalone for mobile)
 *   "both"    → renders both (default, original behaviour)
 */
export default function CartPill({ href = "/cart", cartCount = 0, visible = true, variant = "both" }) {
  const showDesktop = variant === "desktop" || variant === "both";
  const showMobile  = variant === "mobile"  || variant === "both";

  return (
    <>
      {/* ── DESKTOP pill ── */}
      {showDesktop && (
        <a
          href={href}
          className={`
            flex items-center gap-2 rounded-xl
            bg-green-600 backdrop-blur-md
            px-8 py-2 shadow-lg
            hover:shadow-xl
            transition-all duration-300
            hover:-translate-y-1
            relative
          `}
        >
          <FaShoppingCart className="text-white text-lg" />
          <span className="text-sm text-white font-medium">Cart</span>

          {cartCount > 0 && (
            <span className="
              absolute -top-2 -right-2
              min-w-[1.15rem] h-[1.15rem]
              flex items-center justify-center
              bg-orange-500 text-white
              text-[0.6rem] font-bold rounded-full shadow
            ">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </a>
      )}

      {/* ── MOBILE floating circle ── */}
      {showMobile && (
        <div
          className={`
            md:hidden fixed z-50
            transition-all duration-700 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
          `}
          style={{ bottom: "5.5rem", right: "1.25rem" }}
        >
          <a
            href={href}
            className="
              relative flex items-center justify-center
              w-12 h-12 rounded-2xl
              bg-orange-500
              shadow-[0_6px_22px_rgba(249,115,22,0.55)]
              active:scale-90
              transition-transform duration-150
            "
            aria-label="Open cart"
          >
            <FaShoppingCart className="text-white text-xl" />

            {cartCount > 0 && (
              <span className="
                absolute -top-1.5 -right-1.5
                min-w-[1.15rem] h-[1.15rem]
                flex items-center justify-center
                bg-white text-orange-500
                text-[0.6rem] font-black rounded-full
                shadow border border-orange-100
              ">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </a>
        </div>
      )}

      {/* Pulse ring on mobile when cart has items */}
      {cartCount > 0 && (
        <style>{`
          @keyframes cartRing {
            0%   { box-shadow: 0 0 0 0   rgba(249,115,22,0.55); }
            70%  { box-shadow: 0 0 0 10px rgba(249,115,22,0);   }
            100% { box-shadow: 0 0 0 0   rgba(249,115,22,0);    }
          }
        `}</style>
      )}
    </>
  );
}