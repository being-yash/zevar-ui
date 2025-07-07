import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layouts/AdminLayout";
import { fetchVendors } from "../api/vendors";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [modalType, setModalType] = useState(null); // "edit" | "pay"
  const [selectedVendor, setSelectedVendor] = useState(null);

  const getVendors = async () => {
    try {
      const res = await fetchVendors();
      console.log("Fetched vendors:", res);
      setVendors(res);
    } catch (err) {
      console.error("Failed to fetch vendors", err);
    }
  };

  useEffect(() => {
    getVendors();
  }, []);

  const openModal = (vendor, type) => {
    setSelectedVendor(vendor);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedVendor(null);
    setModalType(null);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vendors</h1>
        <p className="text-sm text-gray-500">List of all active vendors and actions</p>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm table-auto">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">GST</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Orders</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor, index) => (
              <tr key={vendor.id} className="border-t hover:bg-gray-50 text-gray-800">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium">{vendor.name}</td>
                <td className="px-4 py-2">{vendor.gst_number || "—"}</td>
                <td className="px-4 py-2">{vendor.address || "—"}</td>
                <td className="px-4 py-2">{vendor.order_count}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => openModal(vendor, "edit")}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openModal(vendor, "pay")}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs hover:bg-green-200"
                  >
                    Pay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Vendor Modal */}
      {modalType === "edit" && selectedVendor && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Vendor
            </h2>
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <form className="space-y-4">
              <input
                defaultValue={selectedVendor.name}
                placeholder="Vendor Name"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                defaultValue={selectedVendor.gst_number}
                placeholder="GST Number"
                className="w-full px-4 py-2 border rounded"
              />
              <textarea
                defaultValue={selectedVendor.address}
                placeholder="Address"
                className="w-full px-4 py-2 border rounded"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Vendor Modal */}
      {modalType === "pay" && selectedVendor && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Pay Vendor
            </h2>
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <form className="space-y-4">
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full px-4 py-2 border rounded"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Pay Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
