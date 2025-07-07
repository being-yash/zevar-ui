import axios from "../api";

export const fetchDashboardStats = async () => {
  const res = await axios.get("/dashboard");
  return res.data;
};
