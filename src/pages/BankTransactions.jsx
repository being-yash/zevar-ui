import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layouts/AdminLayout";
import { fetchBankTransactions, addBankTransaction  } from "../api/banking";
import toast from "react-hot-toast";

export default function BankTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBankTransactions();
        setTransactions(data);
        // Inject new transaction into table state
        // setTransactions((prev) => [data, ...prev]);
      } catch (err) {
        console.error("❌ Failed to load bank transactions", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AdminLayout title="Bank Transactions">
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-2">Bank Transactions</h1>

        <form
        onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target;
            const payload = {
            amount: parseFloat(form.amount.value),
            type: form.type.value,
            mode: form.mode.value,
            reference: form.reference.value,
            remark: form.remark.value || "Payment from customer",
            txn_date: form.txn_date.value || new Date().toISOString().slice(0, 10),
            };

            try {
            const res = await addBankTransaction(payload);
            toast.success("Transaction added!");
            form.reset();
            const data = await fetchBankTransactions();
            setTransactions(data);
            } catch (err) {
            console.error(err);
            toast.error("Failed to add transaction");
            }
        }}
        className="flex flex-wrap items-end gap-3 bg-white border border-gray-200 p-4 rounded-md shadow-sm mb-4"
        >
        <input
            name="amount"
            type="number"
            placeholder="Amount"
            required
            className="border px-3 py-2 rounded text-sm w-28"
        />
        <select
            name="type"
            className="border px-3 py-2 rounded text-sm w-28"
            defaultValue="credit"
        >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
        </select>
        <input
            name="mode"
            type="text"
            placeholder="Mode"
            className="border px-3 py-2 rounded text-sm w-28"
            defaultValue="Bank Transfer"
        />
        <input
            name="reference"
            type="text"
            placeholder="Reference"
            className="border px-3 py-2 rounded text-sm w-40"
        />
        <input
            name="remark"
            type="text"
            placeholder="Remark"
            className="border px-3 py-2 rounded text-sm w-48"
            defaultValue="Payment from customer"
        />
        <input
            name="txn_date"
            type="date"
            className="border px-3 py-2 rounded text-sm w-40"
            defaultValue={new Date().toISOString().slice(0, 10)} // ✅ current date
        />
        <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded text-sm"
        >
            Add
        </button>
        </form>


        {loading ? (
          <div className="text-center text-sm text-gray-500">Loading transactions...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-50 text-gray-700 text-left">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Mode</th>
                  <th className="px-4 py-2">Reference</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Order</th>
                  <th className="px-4 py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, index) => (
                  <tr key={txn.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-medium">₹{txn.amount}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          txn.type === "credit"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-4 py-2">{txn.mode}</td>
                    <td className="px-4 py-2">{txn.reference}</td>
                    <td className="px-4 py-2">{txn.txn_date}</td>
                    <td className="px-4 py-2 text-sm">
                        {!txn.order_transaction_id ? (
                            <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const input = e.target.elements.order_txn_id;
                                const value = input.value.trim();

                                if (!value) return;

                                try {
                                await linkOrderTransaction(txn.id, value);
                                toast.success(`Linked to TXN-${value}`);
                                input.value = "";
                                form.reset();
                                setTransactions((prev) => [data, ...prev]);
                                } catch (err) {
                                toast.error("Failed to link order transaction");
                                }
                            }}
                            >
                            <input
                                type="number"
                                name="order_txn_id"
                                placeholder="Order TXN ID"
                                className="px-2 py-1 border rounded w-28 text-sm"
                            />
                            </form>
                        ) : (
                            <span className="text-xs text-gray-500">Linked to TXN-{txn.order_transaction_id}</span>
                        )}
                    </td>
                    <td className="px-4 py-2">₹{txn.running_balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
