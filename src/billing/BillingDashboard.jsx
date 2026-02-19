export default function BillingDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p>Total Quotations</p>
          <h2 className="text-3xl font-bold"></h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Pending Approvals</p>
          <h2 className="text-3xl font-bold"></h2>
        </div>
      </div>
    </div>
  );
}
