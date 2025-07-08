import api from "../api";

export const fetchBankTransactions = async () => {
  const res = await api.get("/bank-transactions/report");
  return res.data.transactions;
};

export const addBankTransaction = async (payload) => {
  return await api.post("/bank-transactions", payload);
};

export const linkOrderTransaction = async (bankTxnId, orderTxnId) => {
  return await axios.patch(`/bank-transactions/${bankTxnId}`, {
    order_transaction_id: orderTxnId,
    remark: `Linked to order TXN-${orderTxnId}`,
  });
};
