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

// Update individual product price
export const updateProductPrice = async (productId, customer_price) => {
  return await api.patch(`/product-details/${productId}/pricing`, {
    customer_price: parseFloat(customer_price),
  });
};

export const updateShippingInfo = async (payload) => {
  const res = await api.post("/products/update-shipping", payload);
  return res.data;
};

export const markProductsDelivered = async (productIds, deliveryDate, remarks = "") => {
  return await api.post("/product-details/deliver", {
    product_ids: productIds,
    delivery_date: deliveryDate,
    remarks: remarks
  });
};

