import React from "react";
import { useAuth } from "../contexts/AuthContext";

const sidebarLinks = [
  { name: "Dashboard", icon: "🏠" },
  { name: "Users", icon: "👥" },
  { name: "Settings", icon: "⚙️" },
];

function Sidebar({ onLogout }) {
  return (
    <div className="h-screen w-64 bg-blue-900 text-white flex flex-col">
      <div className="p-6 font-bold text-2xl border-b border-blue-800">
        Admin Panel
      </div>
      <nav className="flex-1 p-4">
        <ul>
          {sidebarLinks.map((link) => (
            <li
              key={link.name}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-800 cursor-pointer mb-2"
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </li>
          ))}
        </ul>
      </nav>
      <button
        className="m-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex-1 p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded shadow p-6">
          <div className="text-gray-500">Users</div>
          <div className="text-2xl font-bold">1,234</div>
        </div>
        <div className="bg-white rounded shadow p-6">
          <div className="text-gray-500">Revenue</div>
          <div className="text-2xl font-bold">$12,345</div>
        </div>
        <div className="bg-white rounded shadow p-6">
          <div className="text-gray-500">Active Sessions</div>
          <div className="text-2xl font-bold">87</div>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
        <ul className="divide-y">
          <li className="py-2">User <b>Jane Doe</b> signed up.</li>
          <li className="py-2">User <b>John Smith</b> upgraded plan.</li>
          <li className="py-2">System maintenance completed.</li>
        </ul>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { logout } = useAuth();
  return (
    <div className="flex h-screen">
      <Sidebar onLogout={logout} />
      <AdminDashboard />
    </div>
  );
}
