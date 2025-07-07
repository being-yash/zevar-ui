import React, { useState } from "react";
import { markProductsDelivered } from "../api/orders";
import toast from "react-hot-toast";

export default function MarkDeliveredModal({ productIds = [], order, onClose, onSuccess }) {
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().slice(0, 10));
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deliveryDate) {
      toast.error("Please select delivery date");
      return;
    }

    const finalProductIds = productIds.length > 0 ? productIds : (order?.product_details?.map(p => p.id) || []);
    
    if (finalProductIds.length === 0) {
      toast.error("No products to mark as delivered");
      return;
    }

    try {
      setLoading(true);
      await markProductsDelivered(finalProductIds, deliveryDate, remarks);
      toast.success("Products marked as delivered!");
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("❌ Delivery update failed", err);
      toast.error("Failed to mark as delivered");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Mark as Delivered</h2>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl">×</button>

        <form onSubmit={handleSubmit} className="space-y-4">
          {order && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-600">
                <strong>Order:</strong> {order.order_number}<br/>
                <strong>Customer:</strong> {order.customer?.name}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-600 mb-1">Delivery Date *</label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Delivery Remarks</label>
            <textarea
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any delivery notes..."
              rows={3}
            />
          </div>

          <div className="text-xs text-gray-500">
            <strong>{productIds.length > 0 ? productIds.length : (order?.product_details?.length || 0)}</strong> product(s) will be marked as delivered
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-800"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700"
            >
              {loading ? "Updating..." : "Mark as Delivered"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
