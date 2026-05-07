import { ShoppingBag, Zap } from "lucide-react";

export default function StoreLoader({ label = "Loading store products..." }) {
  return (
    <div className="flex min-h-[360px] w-full items-center justify-center rounded-[32px] border border-[#2F8F6A]/10 bg-gradient-to-br from-[#F7FCF9] via-white to-[#EEF8F2] px-4 py-12 shadow-[0_20px_70px_rgba(47,143,106,0.10)]">
      <div className="relative flex flex-col items-center text-center">
        <div className="absolute h-32 w-32 animate-ping rounded-full bg-[#2F8F6A]/10" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#2F8F6A] shadow-[0_24px_60px_rgba(47,143,106,0.35)]">
          <div className="absolute inset-2 rounded-[22px] border border-white/20" />
          <ShoppingBag className="h-9 w-9 text-white" />
          <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-[#2F8F6A] shadow-lg">
            <Zap size={17} fill="currentColor" />
          </span>
        </div>

        <div className="mt-7 flex items-center justify-center gap-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#2F8F6A]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#2F8F6A] [animation-delay:120ms]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#2F8F6A] [animation-delay:240ms]" />
        </div>

        <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-[#2F8F6A]">
          Infinity Store
        </p>
        <p className="mt-2 text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
