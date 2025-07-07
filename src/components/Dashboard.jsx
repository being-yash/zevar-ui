import React, { useEffect, useState } from "react";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { fetchDashboardStats } from "../api/dashboard";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setData)
      .catch((err) => console.error("Dashboard error", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-gray-500 p-8">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Orders" value={data.total_orders} />
        <StatCard title="Today Orders" value={data.today_orders} />
        <StatCard title="Revenue" value={`₹${data.total_revenue.toLocaleString()}`} />
        <StatCard title="Pending Payments" value={data.pending_payment_orders} />
      </div>

      {/* Top Vendors and Cities */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <InfoBlock
          title="🏆 Top Vendors"
          list={data.top_vendors}
          label="order_count"
          className="flex-1"
        />
        <InfoBlock
          title="📍 Top Cities"
          list={data.top_cities}
          label="orders"
          className="flex-1"
        />
      </div>

      {/* Latest Orders */}
      <div className="bg-white border shadow rounded p-4 overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">🕒 Latest Orders</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left whitespace-nowrap">Order #</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">Customer</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">Amount</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">Payment</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">Created</th>
            </tr>
          </thead>
          <tbody>
            {data.latest_orders.map((order) => (
              <tr key={order.id} className="border-t text-gray-700">
                <td className="px-3 py-2 font-medium">{order.order_number}</td>
                <td className="px-3 py-2">{order.customer_name}</td>
                <td className="px-3 py-2 whitespace-nowrap">₹{order.total_amount}</td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      order.payment_status === "paid"
                        ? "bg-green-100 text-green-700"
                        : order.payment_status === "partial"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs">{order.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

const StatCard = ({ title, value }) => (
  <div className="bg-white border shadow rounded p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-xl font-bold text-gray-800">{value}</h3>
  </div>
);

const InfoBlock = ({ title, list, label, className = "" }) => (
  <div className={`bg-white p-4 rounded shadow border ${className}`}>
    <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
    <ul className="divide-y divide-gray-100">
      {list.map((item, idx) => (
        <li
          key={idx}
          className="flex justify-between items-center text-sm text-gray-700 py-2"
        >
          <span>{item.name || item.city}</span>
          <span className="font-semibold">{item[label]} orders</span>
        </li>
      ))}
    </ul>
  </div>
);
