import React, { useState } from "react";
import { Link } from "react-router-dom";
import PaymentStatusField from "./PaymentStatusField";
import AssignVendorModal from "./AssignVendorModal";
import StatusDropdown from "./StatusDropdown";
import { deleteOrder, deleteProduct } from "../api/orders";
import OrderActions from "./OrderActions";
import AddShippingModal from "./AddShippingModal";
import PriceEditor from "./PriceEditor";
import MarkDeliveredModal from "./MarkDeliveredModal";

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
  activeTab,
}) {
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showDeliveredModal, setShowDeliveredModal] = useState(false);

  const checkedProductIds = Object.entries(checkedProducts?.[order.id] || {})
    .filter(([_, checked]) => checked)
    .map(([pid]) => Number(pid));

  console.log("🔍 OrderCard debug:", {
    orderId: order.id,
    checkedProducts: checkedProducts?.[order.id] || {},
    checkedProductIds,
    activeTab
  });

  // Helper functions for select all/none
  const allProductsSelected = order.product_details?.every(p => 
    checkedProducts?.[order.id]?.[p.id] === true
  );
  
  const someProductsSelected = order.product_details?.some(p => 
    checkedProducts?.[order.id]?.[p.id] === true
  );

  const handleSelectAll = () => {
    order.product_details?.forEach(product => {
      onProductCheck?.(order.id, product.id, true);
    });
  };

  const handleSelectNone = () => {
    order.product_details?.forEach(product => {
      onProductCheck?.(order.id, product.id, false);
    });
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition">
        <td className="px-4 py-3 text-sm text-gray-500" rowSpan={order.product_details?.length || 1}>
          {idx + 1}
        </td>
        <td className="px-4 py-3 font-mono text-sm" rowSpan={order.product_details?.length || 1}>
          <Link to={`/orders/${order.id}`} className="text-teal-600 hover:underline text-xs font-semibold">
            {order.order_number}
          </Link>
        </td>
        <td className="px-4 py-3 text-sm" rowSpan={order.product_details?.length || 1}>
          <div className="font-semibold">{order.customer?.name}</div>
          <div className="text-xs text-gray-500"><strong>Phone:</strong> {order.customer?.mobile_number}</div>
          <div className="text-xs text-gray-500"><strong>Address:</strong> {order.customer?.address}</div>
          <div className="text-xs text-gray-500"><strong>Pincode:</strong> {order.customer?.pincode}</div>
          <div className="text-xs text-gray-500"><strong>City:</strong> {order.customer?.city}, {order.customer?.state}</div>
        </td>
        <td className="px-4 py-3 text-sm font-medium" rowSpan={order.product_details?.length || 1}>
          ₹{order.total_amount}
        </td>

        {activeTab === "pending" && (
          <td className="px-4 py-3 text-sm" rowSpan={order.product_details?.length || 1}>
            <img src={order.product_details[0].image_path} alt="" className="w-12 h-8 object-cover rounded" />
            <StatusDropdown
              orderId={order.id}
              value={order.payment_status}
              onChange={onPaymentStatusChange}
              disabled={updatingId === order.id}
            />
          </td>
        )}

        <td className="px-4 py-3 text-xs text-gray-500" rowSpan={order.product_details?.length || 1}>
          {new Date(order.created_at).toLocaleString()}
        </td>

        {/* First product row */}
        {order.product_details?.length > 0 && (
          <>
            <td className="px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={!!checkedProducts?.[order.id]?.[order.product_details[0].id]}
                onChange={e => onProductCheck?.(order.id, order.product_details[0].id, e.target.checked)}
              />
            </td>
            <td className="px-4 py-3 text-sm">
              <img src={order.product_details[0].image_path} alt="" className="w-12 h-8 object-cover rounded" />
            </td>
            <td className="px-4 py-3 text-sm">
              {activeTab === "pending" ? (
                <PriceEditor product={order.product_details[0]} />
              ) : (
                `₹${order.product_details[0].customer_price}`
              )}
            </td>
          </>
        )}

        <td className="px-4 py-3" rowSpan={order.product_details?.length || 1}>
          {/* Select All/None buttons */}
          {(activeTab === "approved" || activeTab === "shipped") && order.product_details?.length > 1 && (
            <div className="mb-2 flex gap-1">
              <button
                onClick={handleSelectAll}
                disabled={allProductsSelected}
                className={`text-xs px-2 py-1 rounded ${
                  allProductsSelected 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                All
              </button>
              <button
                onClick={handleSelectNone}
                disabled={!someProductsSelected}
                className={`text-xs px-2 py-1 rounded ${
                  !someProductsSelected 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-100 text-red-600 hover:bg-red-200"
                }`}
              >
                None
              </button>
            </div>
          )}
          
          <div className="mt-4">
            <OrderActions
              order={order}
              activeTab={activeTab}
              onRefresh={onVendorAssigned}
              showVendorModal={showVendorModal}
              setShowVendorModal={setShowVendorModal}
              showShippingModal={showShippingModal}
              setShowShippingModal={setShowShippingModal}
              setShowDeliveredModal={setShowDeliveredModal}
              checkedProductIds={checkedProductIds}
            />
          </div>
        </td>
      </tr>

      {/* Additional product rows */}
      {order.product_details?.slice(1).map(product => (
        <tr key={product.id} className="hover:bg-gray-50 transition">
          <td className="px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={!!checkedProducts?.[order.id]?.[product.id]}
              onChange={e => onProductCheck?.(order.id, product.id, e.target.checked)}
            />
          </td>
          <td className="px-4 py-3 text-sm">
            <img src={product.image_path} alt="" className="w-12 h-8 object-cover rounded" />
          </td>
          <td className="px-4 py-3 text-sm">
            {activeTab === "pending" ? (
              <PriceEditor product={product} />
            ) : (
              `₹${product.customer_price}`
            )}
          </td>
        </tr>
      ))}

      {/* Assign Vendor Modal */}
      {showVendorModal && (
        <AssignVendorModal
          orderId={checkedProductIds.length === 0 ? order.id : undefined}
          productIds={checkedProductIds.length > 0 ? checkedProductIds : undefined}
          onClose={() => setShowVendorModal(false)}
          onSuccess={onVendorAssigned}
        />
      )}

      {/* Add Shipping Modal */}
      {showShippingModal && (
        <AddShippingModal
          order={order}
          productIds={checkedProductIds}
          onClose={() => setShowShippingModal(false)}
          onSuccess={onVendorAssigned}
        />
      )}

      {/* Mark Delivered Modal */}
      {showDeliveredModal && (
        <MarkDeliveredModal
          order={order}
          productIds={checkedProductIds.length > 0 ? checkedProductIds : undefined}
          onClose={() => setShowDeliveredModal(false)}
          onSuccess={onVendorAssigned}
        />
      )}
    </>
  );
}
