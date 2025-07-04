import React from "react";

const statusColors = {
  paid: "bg-green-100 text-green-700",
  partial: "bg-orange-100 text-orange-700",
  unpaid: "bg-red-100 text-red-700",
};

export default function PaymentStatusField({ value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[value] || "bg-gray-100 text-gray-700"}`}>
        {value?.charAt(0).toUpperCase() + value?.slice(1)}
      </span>
      <select
        className="ml-2 border rounded px-2 py-1 text-xs"
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
      >
        <option value="paid">Paid</option>
        <option value="partial">Partial</option>
        <option value="unpaid">Unpaid</option>
      </select>
    </div>
  );
}