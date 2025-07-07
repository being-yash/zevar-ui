import React from "react";
import { useNavigate } from "react-router-dom";
import { updateOrderPaymentStatus } from "../api/orders";
import { Eye, Edit, CheckCircle, XCircle, Truck, Package } from "lucide-react";
import toast from "react-hot-toast";

export default function OrderActions({ order, onRefresh, activeTab, showVendorModal, setShowVendorModal, setShowShippingModal, setShowDeliveredModal, checkedProductIds = [] }) {
  const navigate = useNavigate();
  const canAssign = order.payment_status === "paid";

  // Debug log to see what we're working with
  console.log("OrderActions - activeTab:", activeTab, "order.payment_status:", order.payment_status, "checkedProductIds:", checkedProductIds);

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
          onClick={() => setShowVendorModal(true)}
        />
      )}

      {activeTab === "pending" && !canAssign && (
        <FancyButton
          icon={<Truck className="h-4 w-4" />}
          label="Assign Vendor"
          color="gray"
          onClick={() => toast.error("Confirm Payment First!")} 
          disabled={true}
        />
      )}

      {activeTab === "approved" && (
        <FancyButton
          icon={<Truck className="h-4 w-4" />}
          label={`Add Shipping${checkedProductIds.length > 0 ? ` (${checkedProductIds.length})` : " (All)"}`}
          color="indigo"
          onClick={() => {
            console.log("Add Shipping clicked for order:", order.id, "with products:", checkedProductIds);
            setShowShippingModal(true);
          }}
        />
      )}

      {activeTab === "shipped" && (
        <FancyButton
          icon={<Package className="h-4 w-4" />}
          label={`Mark Delivered${checkedProductIds.length > 0 ? ` (${checkedProductIds.length})` : " (All)"}`}
          color="green"
          onClick={() => {
            console.log("Mark Delivered clicked for order:", order.id, "with products:", checkedProductIds);
            setShowDeliveredModal(true);
          }}
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
function FancyButton({ icon, label, color = "gray", onClick, disabled }) {
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
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${base} ${variants[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {icon}
      {label}
    </button>
  );
}