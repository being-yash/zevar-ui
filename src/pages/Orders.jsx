import React, { useEffect, useState } from "react";
import { AdminLayout } from "../components/layouts/AdminLayout";
import OrderCard from "../components/OrderCard";
import { getOrders, updateOrderPaymentStatus } from "../api/orders";

const STATUS_TABS = ["pending", "approved", "shipped", "delivered"];

function getOrdersByProductStatus(orders, status) {
  const filtered = [];
  orders.forEach((order) => {
    const matchingProducts = (order.product_details || []).filter(
      (p) => p.status === status
    );
    if (matchingProducts.length > 0) {
      filtered.push({
        ...order,
        product_details: matchingProducts,
      });
    }
  });
  return filtered;
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [activeTab, setActiveTab] = useState(STATUS_TABS[0]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [checkedProducts, setCheckedProducts] = useState({});

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getOrders(page);
      setOrders(Array.isArray(res.data) ? res.data : []);
      setPagination({
        current_page: res.current_page,
        last_page: res.last_page,
        total: res.total,
      });
    } catch (err) {
      setOrders([]);
      setPagination({ current_page: 1, last_page: 1, total: 0 });
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pagination.current_page);
    // eslint-disable-next-line
  }, [pagination.current_page]);

  const handlePageChange = (page) => {
    if (
      page !== pagination.current_page &&
      page > 0 &&
      page <= pagination.last_page
    ) {
      setPagination((prev) => ({ ...prev, current_page: page }));
    }
  };

  const handlePaymentStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderPaymentStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, payment_status: res.order.payment_status }
            : order
        )
      );
    } catch (err) {
      alert("Failed to update payment status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleProductCheck = (orderId, productId, checked) => {
    setCheckedProducts((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [productId]: checked,
      },
    }));
  };

  const refreshOrders = async () => {
    fetchOrders(pagination.current_page);
  };

  // Filter orders by product status for the active tab
  const filteredOrders = getOrdersByProductStatus(orders, activeTab);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>
      <div className="flex gap-3 mb-6">
        {STATUS_TABS.map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              activeTab === status
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-teal-100"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Order No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Payment
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Order Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Created
              </th>
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Select
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Product Image
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                Product Name
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={11} className="text-center py-8 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-8 text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, idx) => (
                <OrderCard
                  key={order.id + "-" + activeTab}
                  order={order}
                  idx={idx}
                  updatingId={updatingId}
                  onPaymentStatusChange={handlePaymentStatusChange}
                  onProductCheck={handleProductCheck}
                  checkedProducts={checkedProducts}
                  onVendorAssigned={refreshOrders}
                  activeTab={activeTab}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          className="px-3 py-1 rounded bg-gray-200"
          disabled={pagination.current_page === 1}
          onClick={() => handlePageChange(pagination.current_page - 1)}
        >
          Prev
        </button>
        {[...Array(pagination.last_page)].map((_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded ${
              pagination.current_page === i + 1
                ? "bg-teal-600 text-white"
                : "bg-gray-100"
            }`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded bg-gray-200"
          disabled={pagination.current_page === pagination.last_page}
          onClick={() => handlePageChange(pagination.current_page + 1)}
        >
          Next
        </button>
      </div>
    </AdminLayout>
  );
}