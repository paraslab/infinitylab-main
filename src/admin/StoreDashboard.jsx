import React, { useEffect, useMemo, useState } from "react";
import {
  FiFileText,
  FiShoppingBag,
  FiTrendingUp,
  FiDollarSign,
  FiRefreshCw,
  FiArrowUpRight,
  FiClock,
  FiPackage,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../api/axios";

const fmtINR = (n) =>
  "₹" +
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const STATUS_META = {
  pending:    { label: "Pending",    color: "bg-amber-100 text-amber-700 border-amber-200",       dot: "bg-amber-500",   icon: FiClock },
  confirmed:  { label: "Confirmed",  color: "bg-blue-100 text-blue-700 border-blue-200",          dot: "bg-blue-500",    icon: FiCheckCircle },
  processing: { label: "Processing", color: "bg-indigo-100 text-indigo-700 border-indigo-200",    dot: "bg-indigo-500",  icon: FiPackage },
  shipped:    { label: "Shipped",    color: "bg-purple-100 text-purple-700 border-purple-200",    dot: "bg-purple-500",  icon: FiTruck },
  delivered:  { label: "Delivered",  color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", icon: FiCheckCircle },
  cancelled:  { label: "Cancelled",  color: "bg-rose-100 text-rose-700 border-rose-200",          dot: "bg-rose-500",    icon: FiXCircle },
};

function KpiCard({ icon: Icon, label, value, sub, accent, trend }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 group">
      <div
        className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 blur-2xl ${accent}`}
      />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2 tabular-nums">
            {value}
          </p>
          {sub && (
            <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
              {trend != null && (
                <span
                  className={`inline-flex items-center gap-0.5 font-semibold ${
                    trend >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  <FiTrendingUp
                    className={trend < 0 ? "rotate-180" : ""}
                    size={12}
                  />
                  {Math.abs(trend)}%
                </span>
              )}
              <span>{sub}</span>
            </p>
          )}
        </div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent} text-white shadow-sm`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const meta = STATUS_META[status] || {
    label: status || "—",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    dot: "bg-gray-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${meta.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

export default function StoreDashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const [s, q, o] = await Promise.all([
        api.get("/v1/admin/store/dashboard").catch(() => ({ data: null })),
        api
          .get("/v1/admin/quotations", { params: { per_page: 5 } })
          .catch(() => ({ data: null })),
        api
          .get("/v1/admin/purchase-orders", { params: { per_page: 5 } })
          .catch(() => ({ data: null })),
      ]);
      setStats(s.data?.data || null);
      setQuotations(q.data?.data?.data || q.data?.data || []);
      setOrders(o.data?.data?.data || o.data?.data || []);
    } catch (e) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const quotationsKpi = stats?.quotations || {};
  const ordersKpi = stats?.purchase_orders || {};
  const byStatus = ordersKpi.by_status || {};

  const statusTotal = useMemo(
    () => Object.values(byStatus).reduce((a, b) => a + Number(b || 0), 0) || 1,
    [byStatus]
  );

  const conversionRate = useMemo(() => {
    const q = Number(quotationsKpi.total || 0);
    const o = Number(ordersKpi.total || 0);
    if (!q) return 0;
    return Math.round((o / q) * 100);
  }, [quotationsKpi, ordersKpi]);

  const trendQuotations = useMemo(() => {
    const total = Number(quotationsKpi.total || 0);
    const tm = Number(quotationsKpi.this_month || 0);
    const prev = Math.max(total - tm, 0);
    if (!prev) return tm > 0 ? 100 : 0;
    return Math.round(((tm - prev / Math.max(1, 1)) / prev) * 100);
  }, [quotationsKpi]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-white border border-gray-100 animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-72 rounded-2xl bg-white border border-gray-100 animate-pulse lg:col-span-2" />
          <div className="h-72 rounded-2xl bg-white border border-gray-100 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Store Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Realtime snapshot of quotations, purchase orders and revenue.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-60 shadow-sm"
          >
            <FiRefreshCw
              className={refreshing ? "animate-spin" : ""}
              size={14}
            />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
          <FiAlertCircle className="mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={FiFileText}
          label="Total Quotations"
          value={Number(quotationsKpi.total || 0).toLocaleString("en-IN")}
          sub={`${quotationsKpi.this_month || 0} this month`}
          accent="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
        <KpiCard
          icon={FiShoppingBag}
          label="Purchase Orders"
          value={Number(ordersKpi.total || 0).toLocaleString("en-IN")}
          sub={`${ordersKpi.this_month || 0} this month`}
          accent="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <KpiCard
          icon={FiDollarSign}
          label="Revenue (Orders)"
          value={fmtINR(ordersKpi.total_value)}
          sub={`${fmtINR(ordersKpi.this_month_value)} this month`}
          accent="bg-gradient-to-br from-amber-500 to-orange-500"
        />
        <KpiCard
          icon={FiTrendingUp}
          label="Conversion Rate"
          value={`${conversionRate}%`}
          sub="Quotation → Order"
          accent="bg-gradient-to-br from-rose-500 to-pink-600"
        />
      </div>

      {/* Status + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Status breakdown */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Order Status Distribution
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Breakdown of {Number(ordersKpi.total || 0)} purchase orders
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(byStatus).map(([status, count]) => {
              const meta = STATUS_META[status] || {
                label: status,
                color: "bg-gray-100 text-gray-700",
                dot: "bg-gray-500",
              };
              const pct = Math.round((count / statusTotal) * 100);
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${meta.dot}`}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {meta.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-semibold text-gray-900 tabular-nums">
                        {count}
                      </span>
                      <span className="text-gray-400 tabular-nums w-10 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full ${meta.dot} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(byStatus).length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">
                No purchase orders yet.
              </p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 shadow-sm">
          <h3 className="text-base font-semibold">Quick Actions</h3>
          <p className="text-xs text-gray-400 mt-1">Jump to common tasks</p>

          <div className="mt-5 space-y-2">
            {[
              { key: "products", label: "Manage Products", icon: FiPackage },
              { key: "product-categories", label: "Categories", icon: FiFileText },
              { key: "inquiries", label: "Customer Inquiries", icon: FiClock },
              { key: "media", label: "Media Library", icon: FiPackage },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.key}
                  onClick={() => onNavigate?.(a.key)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <Icon size={16} className="text-gray-400" />
                    {a.label}
                  </span>
                  <FiArrowUpRight
                    size={14}
                    className="text-gray-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                Quoted Value
              </p>
              <p className="text-base font-bold mt-1 tabular-nums">
                {fmtINR(quotationsKpi.total_value)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                This Month
              </p>
              <p className="text-base font-bold mt-1 tabular-nums">
                {fmtINR(quotationsKpi.this_month_value)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent quotations */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Recent Quotations
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Latest 5 customer quote requests
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Quote</th>
                  <th className="text-left px-6 py-3 font-semibold">Customer</th>
                  <th className="text-right px-6 py-3 font-semibold">Total</th>
                  <th className="text-right px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quotations.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-sm text-gray-400"
                    >
                      No quotations yet
                    </td>
                  </tr>
                )}
                {quotations.slice(0, 5).map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[12px] font-semibold text-indigo-600">
                        {q.quote_no}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-gray-900">{q.name}</p>
                      <p className="text-xs text-gray-500">
                        {q.company || q.email}
                      </p>
                    </td>
                    <td className="px-6 py-3.5 text-right font-semibold text-gray-900 tabular-nums">
                      {fmtINR(q.grand_total)}
                    </td>
                    <td className="px-6 py-3.5 text-right text-xs text-gray-500">
                      {fmtDate(q.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent orders */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Recent Purchase Orders
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Latest 5 confirmed orders
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Order</th>
                  <th className="text-left px-6 py-3 font-semibold">Customer</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-right px-6 py-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-sm text-gray-400"
                    >
                      No purchase orders yet
                    </td>
                  </tr>
                )}
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[12px] font-semibold text-emerald-600">
                        {o.order_no}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-gray-900">
                        {o.first_name} {o.last_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {o.company || o.email}
                      </p>
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right font-semibold text-gray-900 tabular-nums">
                      {fmtINR(o.grand_total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
