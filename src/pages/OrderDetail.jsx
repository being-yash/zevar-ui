import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { getOrderById } from "../api/orders";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-10 text-gray-500">Loading...</div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-10 text-red-500">Order not found.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-4">
        <Link to="/orders" className="text-teal-600 hover:underline text-sm">&larr; Back to Orders</Link>
      </div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Order #{order.order_number}</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="mb-2"><b>Customer:</b> {order.customer?.name} ({order.customer?.mobile_number})</div>
        <div className="mb-2"><b>Total Amount:</b> ₹{order.total_amount}</div>
        <div className="mb-2"><b>Payment Status:</b> {order.payment_status}</div>
        <div className="mb-2"><b>Order Status:</b> {order.order_status}</div>
        <div className="mb-2"><b>Remark:</b> {order.remark}</div>
        <div className="mb-2"><b>Created At:</b> {new Date(order.created_at).toLocaleString()}</div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Image</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Price</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {order.product_details?.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2">
                    <img src={product.image_path} alt="" className="w-20 h-14 object-cover rounded" />
                  </td>
                  <td className="px-4 py-2">{product.image_path.split("?text=")[1] || "Product"}</td>
                  <td className="px-4 py-2">₹{product.customer_price}</td>
                  <td className="px-4 py-2">{product.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}