import React, { useEffect, useState } from "react";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { fetchTransactions } from "../api/transactions";

export default function OrderTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const loadTransactions = () => {
    fetchTransactions({
      search,
      mode,
      status,
      from_date: from,
      to_date: to,
    }).then(setTransactions);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">💳 Transactions</h1>
        <p className="text-sm text-gray-500">All customer payments and transaction records</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search name or order..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 text-sm border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full px-4 py-2 text-sm border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">All Modes</option>
            <option value="UPI">UPI</option>
            <option value="Razorpay">Razorpay</option>
            <option value="Cash">Cash</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 text-sm border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
          </select>

          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full px-4 py-2 text-sm border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />

          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-4 py-2 text-sm border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={loadTransactions}
            className="bg-teal-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-teal-700 text-sm transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm table-auto">
          <thead className="bg-gray-50 text-gray-600 font-medium text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Txn ID</th>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Mode</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Remark</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
            {transactions.map((txn, index) => (
              <tr key={txn.id} className="border-t hover:bg-gray-50 text-gray-800">
                <td className="px-4 py-2 font-medium text-xs">{index + 1}</td>
                <td className="px-4 py-2">{txn.trans_id}</td>
                <td className="px-4 py-2">{txn.order_number}</td>
                <td className="px-4 py-2">{txn.customer_name}</td>
                <td className="px-4 py-2">₹{txn.trans_amount}</td>
                <td className="px-4 py-2">{txn.mode}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      txn.payment_status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {txn.payment_status}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs">{txn.trans_date}</td>
                <td className="px-4 py-2 text-xs">{txn.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
