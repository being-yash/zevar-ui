import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 font-inter">
        <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Zevar Logo" className="h-12" /> {/* optional branding */}
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>

        {error && (
            <div className="text-red-600 text-sm text-center mb-4 bg-red-100 px-4 py-2 rounded">
            {error}
            </div>
        )}

        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            />
        </div>

        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            />
        </div>

        <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md shadow transition duration-150"
        >
            Login
        </button>
    </form>
  );
}