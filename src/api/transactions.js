import api from "../api";

export const fetchTransactions = async (params = {}) => {
  const res = await api.get("/order-transactions/report", { params });
  return res.data.transactions;
};