import React from "react";
import { useNavigate } from "react-router-dom";
import { updateOrderPaymentStatus } from "../api/orders";

export default function OrderActions({ order, onRefresh, activeTab, showVendorModal, setShowVendorModal }) {
  const navigate = useNavigate();
  const canAssign = order.payment_status === "paid";

  const handleConfirm = async () => {
    try {
      await updateOrderPaymentStatus(order.id, "paid");
      onRefresh?.();
    } catch (err) {
      console.error("❌ Failed to confirm payment", err);
    }
  };

  const handleCancel = async () => {
    const sure = window.confirm("Are you sure you want to cancel this order?");
    if (!sure) return;

    try {
      await updateOrderPaymentStatus(order.id, "cancelled");
      onRefresh?.();
    } catch (err) {
      console.error("❌ Cancel failed", err);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* <button
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-sm"
        onClick={() => navigate(`/orders/${order.id}`)}
      >
        View
      </button> */}

      {activeTab === "pending" && canAssign && (
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm"
          onClick={() => setShowVendorModal(true)}
        >
          Assign Vendor
        </button>
      )}
      
      {activeTab === "pending" && (
        <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded text-sm"
            onClick={() => navigate(`/orders/${order.id}/edit`)}
        >
            Edit Order
        </button>
      )}

      {!canAssign && (
        <button
          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1.5 rounded text-sm cursor-not-allowed"
          disabled
        >
          Assign Vendor (Confirm Payment First)
        </button>
      )}
      {order.payment_status != "paid" && ( 
      <button
        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm"
        onClick={handleConfirm}
      >
        Confirm Payment
      </button>
      )}

      {(activeTab === "pending" || activeTab === "approved") && (
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
        onClick={handleCancel}
      >
        Cancel Order
      </button>
      )}
    </div>
  );
}
