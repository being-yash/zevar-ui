import React, { useState } from "react";
import { Pencil, Check } from "lucide-react";
import { updateProductPrice } from "../api/orders";
import toast from "react-hot-toast";

export default function PriceEditor({ product }) {
  const [price, setPrice] = useState(product.customer_price);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProductPrice(product.id, price);
      toast.success("Price updated!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update price");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        disabled={!isEditing || loading}
        className={`px-2 py-1 w-20 rounded border text-sm transition ${
          isEditing
            ? "border-teal-500 bg-white text-gray-800"
            : "border-gray-200 bg-gray-100 text-gray-400"
        }`}
      />
      {!isEditing ? (
        <button
          type="button"
          className="text-gray-500 hover:text-teal-600"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          className="text-green-600 hover:text-green-700"
          onClick={handleSave}
          disabled={loading}
        >
          <Check className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
