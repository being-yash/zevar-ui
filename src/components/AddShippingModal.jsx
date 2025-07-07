import React, { useState } from "react";
import toast from "react-hot-toast";
import { updateShippingInfo } from "../api/orders"; // you’ll create this

export default function AddShippingModal({ order, productIds = [], onClose, onSuccess }) {
  console.log("🚚 AddShippingModal received:", { 
    orderId: order.id,
    productIds,
    allProducts: order.product_details?.map(p => p.id) || []
  });

  const [awb, setAwb] = useState("");
  const [courierId, setCourierId] = useState("");
  
  // Filter products based on checked products or use all products
  const selectedProducts = productIds.length > 0 
    ? order.product_details.filter(p => productIds.includes(p.id))
    : order.product_details;

  console.log("🚚 Selected products:", selectedProducts?.map(p => p.id) || []);
    
  const [productPrices, setProductPrices] = useState(
    selectedProducts.map((p) => ({
      id: p.id,
      vendor_purchase_amount: p.vendor_purchase_amount || "",
    }))
  );

  const handlePriceChange = (id, value) => {
    setProductPrices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, vendor_purchase_amount: value } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!awb || !courierId) {
      toast.error("AWB and courier are required.");
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error("No products selected for shipping.");
      return;
    }

    try {
      console.log("🚚 Submitting shipping info:", {
        awb_number: awb,
        courier_company_id: parseInt(courierId),
        products: productPrices.map((p) => ({
          id: p.id,
          vendor_purchase_amount: parseFloat(p.vendor_purchase_amount || 0),
        })),
      });

      await updateShippingInfo({
        awb_number: awb,
        courier_company_id: parseInt(courierId),
        products: productPrices.map((p) => ({
          id: p.id,
          vendor_purchase_amount: parseFloat(p.vendor_purchase_amount || 0),
        })),
      });

      toast.success("Shipping info submitted successfully!");
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to update shipping info.");
      console.error("❌ Shipping submit error", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Shipping Information</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* Order Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600">
            <strong>Order:</strong> {order.order_number} | <strong>Customer:</strong> {order.customer?.name}
          </div>
          <div className="text-sm text-blue-600 mt-1">
            <strong>{selectedProducts.length}</strong> product(s) selected 
            {productIds.length > 0 ? " (from checked items)" : " (all products)"}
          </div>
          {productIds.length > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Selected Product IDs: {productIds.join(", ")}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              placeholder="AWB Number"
              className="w-full px-4 py-2 border rounded"
              required
            />

            <select
              value={courierId}
              onChange={(e) => setCourierId(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            >
              <option value="">Select Courier</option>
              <option value="1">Delhivery</option>
              <option value="2">Shiprocket</option>
              <option value="3">Bluedart</option>
            </select>
          </div>

          <div className="overflow-x-auto mt-4">
            {selectedProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No products selected for shipping</p>
                <p className="text-sm mt-2">Please go back and select products by checking the boxes next to them.</p>
              </div>
            ) : (
              <table className="w-full table-auto text-sm border">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">Image</th>
                    <th className="px-3 py-2 text-left">Vendor Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {productPrices.map((product, index) => {
                    const original = selectedProducts.find((p) => p.id === product.id);
                    return (
                      <tr key={product.id} className="border-t">
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">
                          <img
                            src={original?.image_path}
                            alt="product"
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            {original?.image_path?.split("?text=")[1] || "Product"}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={product.vendor_purchase_amount}
                            onChange={(e) =>
                              handlePriceChange(product.id, e.target.value)
                            }
                            placeholder="Enter vendor price"
                            required
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedProducts.length === 0}
              className={`px-4 py-2 rounded ${
                selectedProducts.length === 0 
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                  : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
