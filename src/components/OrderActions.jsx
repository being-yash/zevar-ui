import React from "react";
import { useNavigate } from "react-router-dom";
import { updateOrderPaymentStatus } from "../api/orders";
import { Eye, Edit, CheckCircle, XCircle, Truck } from "lucide-react";
import toast from "react-hot-toast";

export default function OrderActions({ order, onRefresh, activeTab, showVendorModal, setShowVendorModal }) {
  const navigate = useNavigate();
  const canAssign = order.payment_status === "paid";

  const handleConfirm = async () => {
    try {
      await updateOrderPaymentStatus(order.id, "paid");
      toast.success("Payment confirmed successfully!");
      onRefresh?.();
    } catch (err) {
      console.error("❌ Failed to confirm payment", err);
      toast.error("Failed to confirm payment. Please try again.");
    }
  };

  const handleCancel = async () => {
    const sure = window.confirm("Are you sure you want to cancel this order?");
    if (!sure) return;

    try {
      await updateOrderPaymentStatus(order.id, "cancelled");
      toast.success("Order cancelled successfully!");
      onRefresh?.();
    } catch (err) {
      console.error("❌ Cancel failed", err);
      toast.error("Failed to cancel order. Please try again.");
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <FancyButton
        icon={<Eye className="h-4 w-4" />}
        label="View"
        color="gray"
        onClick={() => navigate(`/orders/${order.id}`)}
      />

      {activeTab === "pending" && canAssign &&  (
        <FancyButton
          icon={<Truck className="h-4 w-4" />}
          label="Assign Vendor"
          color="indigo"
          onClick={() => navigate(`/orders/${order.id}/assign-vendor`)}
        />
      )}

      {activeTab === "pending" && !canAssign && (
        <FancyButton
          icon={<Truck className="h-4 w-4" />}
          label="Assign Vendor"
          color="gray"
          onClick={ () => toast.error("Confirm Payment First!")} 
          disabled
        />
      )}

      {activeTab === "pending" &&(
      <FancyButton
        icon={<Edit className="h-4 w-4" />}
        label="Edit"
        color="yellow"
        onClick={() => navigate(`/orders/${order.id}/edit`)}
      />
      )}

      {order.payment_status != "paid" && ( 
        <FancyButton
          icon={<CheckCircle className="h-4 w-4" />}
          label="Confirm"
          color="green"
          onClick={handleConfirm}
        />
      )}

      {activeTab === "pending" &&(
      <FancyButton
        icon={<XCircle className="h-4 w-4" />}
        label="Cancel"
        color="red"
        onClick={handleCancel}
      />
      )}
    </div>
  );
}
  // 🎨 Reusable Fancy Button
function FancyButton({ icon, label, color = "gray", onClick }) {
  const base =
    "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium shadow transition";
  const variants = {
    gray: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    indigo: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
    yellow: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    green: "bg-green-100 text-green-700 hover:bg-green-200",
    red: "bg-red-100 text-red-700 hover:bg-red-200",
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[color]}`}>
      {icon}
      {label}
    </button>
  );
}


{/* <div className="flex flex-wrap gap-2"> */}
      {/* <button
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-sm"
        onClick={() => navigate(`/orders/${order.id}`)}
      >
        View
      </button> */}

      {/* {activeTab === "pending" && canAssign && (
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
    </div> */}
