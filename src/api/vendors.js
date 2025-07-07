import api from "../api";

export async function getVendors() {
  const res = await api.get("/vendors");
  return res.data?.data || [];
}

export const fetchVendors = async () => {
  const res = await api.get("/vendors");
  return res.data?.data || [];
};