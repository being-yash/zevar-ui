import React, { useState } from "react";

const STATUS_OPTIONS = [
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-700" },
  { value: "partial", label: "Partial", color: "bg-yellow-100 text-yellow-700" },
  { value: "unpaid", label: "Unpaid", color: "bg-red-100 text-red-700" },
];

export default function StatusDropdown({ orderId, value, onChange, disabled }) {
  const [selected, setSelected] = useState(value);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentOption = STATUS_OPTIONS.find((opt) => opt.value === selected);

  const handleChange = async (val) => {
    if (val === selected) return;
    setLoading(true);
    try {
      await onChange(orderId, val);
      setSelected(val);
      setOpen(false);
    } catch (error) {
      console.error("❌ Status update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${currentOption?.color} hover:shadow transition`}
        disabled={disabled}
      >
        {currentOption?.label}
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <ul className="py-1 text-sm">
            {STATUS_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${opt.color}`}
                  onClick={() => handleChange(opt.value)}
                  disabled={loading}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}