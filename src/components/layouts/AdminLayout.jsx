import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";

const sidebarLinks = [
  { name: "Dashboard", icon: "🏠", path: "/" },
  { name: "Orders", icon: "📦", path: "/orders" },
  { name: "Users", icon: "👥", path: "/users" },
  { name: "Add Vendor", icon: "➕", path: "/vendors/add" }, // <-- Add this line
  { name: "Settings", icon: "⚙️", path: "/settings" },
];

export function Sidebar({ onLogout }) {
  const location = useLocation();
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-md font-inter flex flex-col">
      <div className="px-6 py-5 text-2xl font-extrabold text-teal-700 tracking-wide border-b border-gray-100">
        Zevar Admin
      </div>
      <nav className="flex-1 px-4 pt-6">
        <ul className="space-y-2">
          {sidebarLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-teal-100 cursor-pointer text-sm font-medium transition ${
                  location.pathname === link.path ? "bg-teal-100 font-semibold" : ""
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button
        className="m-4 mt-auto bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold shadow"
        onClick={onLogout}
      >
        Logout
      </button>
    </aside>
  );
}

export function AdminLayout({ children }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">{children}</main>
    </div>
  );
}

export default AdminLayout;