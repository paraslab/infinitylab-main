import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiFileText,
  FiHome,
  FiSearch,
  FiBell,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function BillingLayout() {
  const navigate = useNavigate();

  // sidebarMode: "expanded" | "small" | "hidden"
  const [sidebarMode, setSidebarMode] = useState("expanded");
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/billing");
  };

  // Prevent body scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [mobileOpen]);

  // Cycle sidebar mode (expanded -> small -> hidden -> expanded)
  const toggleSidebarMode = () => {
    setSidebarMode((prev) => {
      if (prev === "expanded") return "small";
      if (prev === "small") return "hidden";
      return "expanded";
    });
  };

  const isHidden = sidebarMode === "hidden";
  const isSmall = sidebarMode === "small";

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* ================= SIDEBAR (desktop) ================= */}
      {!isHidden && (
        <aside
          className={`hidden md:flex flex-col transition-all duration-300 bg-slate-900 text-white ${
            isSmall ? "w-20" : "w-72"
          }`}
        >
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
            {!isSmall && (
              <h2 className="text-lg font-bold tracking-wide">
                Infinity Billing
              </h2>
            )}

            <button
              onClick={toggleSidebarMode}
              aria-label="Toggle sidebar mode"
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition"
            >
              {isSmall ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
            <SidebarItem
              to="/billing/dashboard"
              icon={<FiHome size={18} />}
              label="Dashboard"
              collapsed={isSmall}
            />
            <SidebarItem
              to="/billing/quotation"
              icon={<FiFileText size={18} />}
              label="Quotation"
              collapsed={isSmall}
            />
          </nav>
        </aside>
      )}

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          <aside className="fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-white md:hidden">
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
              <h2 className="text-lg font-bold">Infinity Billing</h2>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition"
              >
                <FiX size={20} />
              </button>
            </div>

            <nav className="p-3 space-y-2 overflow-y-auto">
              <SidebarItemMobile
                to="/billing/dashboard"
                icon={<FiHome size={18} />}
                label="Dashboard"
                onClick={() => setMobileOpen(false)}
              />
              <SidebarItemMobile
                to="/billing/quotation"
                icon={<FiFileText size={18} />}
                label="Quotation"
                onClick={() => setMobileOpen(false)}
              />
            </nav>
          </aside>
        </>
      )}

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">
        {/* ================= TOPBAR ================= */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 transition"
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>

            {/* Desktop sidebar toggle */}
            <button
              onClick={toggleSidebarMode}
              className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition"
              aria-label="Toggle sidebar"
            >
              <FiMenu size={18} className="text-slate-600" />
            </button>

            {/* Search */}
            <div className="hidden sm:flex items-center gap-3 w-full max-w-md bg-slate-100 border border-slate-200 rounded-lg px-3 py-2">
              <FiSearch className="text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent outline-none text-sm text-slate-700"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* Search icon mobile */}
            <button
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 transition md:hidden"
              aria-label="Search"
            >
              <FiSearch className="text-slate-600" />
            </button>

            <button
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 transition"
              aria-label="Notifications"
            >
              <FiBell className="text-slate-600" size={18} />
            </button>

            {/* User + Logout */}
            <div className="flex items-center gap-3">
              <button
                onClick={logout}
                className="ml-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-white text-sm font-semibold"
              >
                <FiLogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= SIDEBAR ITEM (desktop collapsed-aware) ================= */
function SidebarItem({ to, icon, label, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-slate-300 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      <div className="w-8 flex justify-center">{icon}</div>
      {!collapsed && <span className="font-medium">{label}</span>}
    </NavLink>
  );
}

/* ================= SIDEBAR ITEM (mobile) ================= */
function SidebarItemMobile({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-slate-300 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      <div className="w-8 flex justify-center">{icon}</div>
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}
