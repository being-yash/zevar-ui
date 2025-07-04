import React, { useState } from "react";
import { Link } from "react-router-dom";
import PaymentStatusField from "./PaymentStatusField";
import AssignVendorModal from "./AssignVendorModal";
import StatusDropdown from "./StatusDropdown";
import { deleteOrder, deleteProduct } from "../api/orders";

const statusColors = {
  shipped: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function StatusSwatch({ status }) {
  const color = statusColors[status] || "bg-gray-100 text-gray-700";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

export default function OrderCard({
  order,
  idx,
  updatingId,
  onPaymentStatusChange,
  onProductCheck,
  checkedProducts,
  onVendorAssigned,
  activeTab, // <-- add this line
}) {
  // Show for paid or partial
  const canAssign = order.payment_status === "paid" || order.payment_status === "partial";
  const [showVendorModal, setShowVendorModal] = useState(false);

  // Get checked product ids for this order
  const checkedProductIds = Object.entries(checkedProducts?.[order.id] || {})
    .filter(([_, checked]) => checked)
    .map(([pid]) => Number(pid));

  // Handler for assign vendor button
  const handleAssignVendor = () => {
    if (canAssign) {
      setShowVendorModal(true);
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition">
        <td className="px-4 py-3 text-sm text-gray-500" rowSpan={order.product_details?.length || 1}>
          {idx + 1}
        </td>
        <td className="px-4 py-3 font-mono text-sm" rowSpan={order.product_details?.length || 1}>
          {order.order_number}
        </td>
        <td className="px-4 py-3 text-sm" rowSpan={order.product_details?.length || 1}>
          <div className="font-semibold">{order.customer?.name}</div>
          <div className="text-xs text-gray-500">{order.customer?.mobile_number}</div>
        </td>
        <td className="px-4 py-3 text-sm font-medium" rowSpan={order.product_details?.length || 1}>
          ₹{order.total_amount}
        </td>
        <td className="px-4 py-3 text-sm" rowSpan={order.product_details?.length || 1}>
          <StatusDropdown
            orderId={order.id}
            value={order.payment_status}
            onChange={onPaymentStatusChange}
            disabled={updatingId === order.id}
          />
        </td>
        <td className="px-4 py-3 text-sm" rowSpan={order.product_details?.length || 1}>
          <StatusSwatch status={order.order_status} />
        </td>
        <td className="px-4 py-3 text-xs text-gray-500" rowSpan={order.product_details?.length || 1}>
          {new Date(order.created_at).toLocaleString()}
        </td>
        <td className="px-4 py-3" rowSpan={order.product_details?.length || 1}>
          <Link
            to={`/orders/${order.id}`}
            className="text-teal-600 hover:underline text-xs font-semibold"
          >
            View
          </Link>
          <button
            className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
            onClick={async () => {
              if (window.confirm("Delete this order?")) {
                await deleteOrder(order.id);
                onVendorAssigned?.(); // refresh list
              }
            }}
          >
            Delete
          </button>
          {canAssign && (
            <button
              className="ml-2 text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded hover:bg-teal-200"
              onClick={handleAssignVendor}
            >
              Assign Vendor
            </button>
          )}
        </td>
        {/* First product row */}
        {order.product_details && order.product_details.length > 0 && (
          <>
            <td className="px-4 py-3 text-sm">
              {canAssign && (
                <input
                  type="checkbox"
                  checked={!!checkedProducts?.[order.id]?.[order.product_details[0].id]}
                  onChange={e => onProductCheck?.(order.id, order.product_details[0].id, e.target.checked)}
                />
              )}
            </td>
            <td className="px-4 py-3 text-sm">
              <img src={order.product_details[0].image_path} alt="" className="w-12 h-8 object-cover rounded" />
            </td>
            <td className="px-4 py-3 text-sm">
              {order.product_details[0].image_path.split("?text=")[1] || "Product"}
            </td>
          </>
        )}
      </tr>
      {/* Render remaining products if any */}
      {order.product_details &&
        order.product_details.slice(1).map(product => (
          <tr key={product.id} className="hover:bg-gray-50 transition">
            <td className="px-4 py-3 text-sm">
              {canAssign && (
                <input
                  type="checkbox"
                  checked={!!checkedProducts?.[order.id]?.[product.id]}
                  onChange={e => onProductCheck?.(order.id, product.id, e.target.checked)}
                />
              )}
            </td>
            <td className="px-4 py-3 text-sm">
              <img src={product.image_path} alt="" className="w-12 h-8 object-cover rounded" />
            </td>
            <td className="px-4 py-3 text-sm">
              {product.image_path.split("?text=")[1] || "Product"}
            </td>
            {activeTab === "pending" && canAssign && (
              <button
                className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                onClick={async () => {
                  if (window.confirm("Delete this product?")) {
                    await deleteProduct(product.id);
                    onVendorAssigned?.(); // refresh list
                  }
                }}
                disabled={!checkedProducts?.[order.id]?.[product.id]}
              >
                Delete
              </button>
            )}
          </tr>
        ))}
      {/* Modal */}
      {showVendorModal && (
        <AssignVendorModal
          orderId={checkedProductIds.length === 0 ? order.id : undefined}
          productIds={checkedProductIds.length > 0 ? checkedProductIds : undefined}
          onClose={() => setShowVendorModal(false)}
          onSuccess={onVendorAssigned}
        />
      )}
    </>
  );
}