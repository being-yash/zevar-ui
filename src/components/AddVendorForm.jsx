import React, { useState } from "react";
import api from "../api";

export default function AddVendorForm({ onSuccess }) {
  const [form, setForm] = useState({
    user: {
      name: "",
      email: "",
      password: "",
    },
    name: "",
    phone_number: "",
    whatsapp_number: "",
    shop_name: "",
    address: "",
    pincode: "",
    city: "",
    gst_number: "",
    pickup_time: "",
    preferred_courier_id: "",
    is_deleted: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("user.")) {
      setForm((prev) => ({
        ...prev,
        user: { ...prev.user, [name.replace("user.", "")]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/vendors", form);
      setForm({
        user: { name: "", email: "", password: "" },
        name: "",
        phone_number: "",
        whatsapp_number: "",
        shop_name: "",
        address: "",
        pincode: "",
        city: "",
        gst_number: "",
        pickup_time: "",
        preferred_courier_id: "",
        is_deleted: false,
      });
      onSuccess?.();
      alert("Vendor added!");
    } catch (err) {
      setError("Failed to add vendor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Add Vendor</h2>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <div className="mb-3">
        <label className="block text-sm font-medium">User Name</label>
        <input name="user.name" value={form.user.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">User Email</label>
        <input name="user.email" type="email" value={form.user.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">User Password</label>
        <input name="user.password" type="password" value={form.user.password} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Vendor Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Phone Number</label>
        <input name="phone_number" value={form.phone_number} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">WhatsApp Number</label>
        <input name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Shop Name</label>
        <input name="shop_name" value={form.shop_name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Address</label>
        <input name="address" value={form.address} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Pincode</label>
        <input name="pincode" value={form.pincode} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">City</label>
        <input name="city" value={form.city} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">GST Number</label>
        <input name="gst_number" value={form.gst_number} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Pickup Time</label>
        <input name="pickup_time" type="time" value={form.pickup_time} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Preferred Courier ID</label>
        <input name="preferred_courier_id" value={form.preferred_courier_id} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Is Deleted</label>
        <select name="is_deleted" value={form.is_deleted} onChange={e => setForm(f => ({ ...f, is_deleted: e.target.value === "true" }))} className="w-full border px-3 py-2 rounded">
          <option value={false}>No</option>
          <option value={true}>Yes</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-teal-600 text-white px-6 py-2 rounded font-semibold"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Vendor"}
      </button>
    </form>
  );
}