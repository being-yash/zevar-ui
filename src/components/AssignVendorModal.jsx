import React, { useState, useEffect } from "react";
import { getVendors } from "../api/vendors";
import api from "../api";

export default function AssignVendorModal({
  orderId,
  productIds, // array of product ids if assigning to products
  onClose,
  onSuccess,
}) {
  const [vendorId, setVendorId] = useState("");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    getVendors().then(setVendors).catch(() => setVendors([]));
  }, []);

  const handleAssign = async () => {
    if (!vendorId) return;
    setLoading(true);
    try {
      if (productIds && productIds.length > 0) {
        await api.post(`/product-details/${productIds[0]}/assign-vendor`, {
          vendor_id: vendorId,
          product_ids: productIds,
        });
      } else if (orderId) {
        if (!confirm) {
          setConfirm(true);
          setLoading(false);
          return;
        }
        await api.post(`/orders/${orderId}/assign-vendor`, {
          vendor_id: vendorId,
        });
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Assign failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Assign Vendor</h2>
        <label className="block mb-2 text-sm text-gray-600">Select a Vendor</label>
        <select
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="">-- Select Vendor --</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        {confirm && (
          <div className="mb-4 text-red-600 text-sm">
            No product selected. Do you want to assign the vendor to the entire order?
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded text-sm">
            Cancel
          </button>
          <button
            disabled={loading || !vendorId}
            onClick={handleAssign}
            className="bg-teal-600 text-white px-4 py-2 rounded text-sm hover:bg-teal-700"
          >
            {loading ? "Assigning..." : "Assign Vendor"}
          </button>
        </div>
      </div>
    </div>
  );
}