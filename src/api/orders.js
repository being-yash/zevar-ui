import api from "../api";

export async function getOrders(page = 1) {
  const res = await api.get(`/orders?page=${page}&per_page=10`);
  return res.data;
}

export async function getOrderById(id) {
  const res = await api.get(`/orders/${id}`);
  return res.data;
}

export async function updateOrderPaymentStatus(id, payment_status) {
  const res = await api.patch(`/orders/${id}/payment-status`, { payment_status });
  return res.data;
}

export async function deleteOrder(orderId) {
  return api.delete(`/orders/${orderId}`);
}

export async function deleteProduct(productId) {
  return api.delete(`/product-details/${productId}`);
}