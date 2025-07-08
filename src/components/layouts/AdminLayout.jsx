import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";

const sidebarLinks = [
  { name: "Dashboard", icon: "🏠", path: "/" },
  { name: "Orders", icon: "📦", path: "/orders" },
  {
    name: "Banking",
    icon: "💰",
    children: [
      { name: "Order Transactions", path: "/order-transactions" },
      { name: "Bank Transactions", path: "/bank-transactions" },
    ],
  },
  { name: "Vendors", icon: "🧑‍🏭", path: "/vendors" },
  { name: "Users", icon: "👥", path: "/users" },
  { name: "Add Vendor", icon: "➕", path: "/vendors/add" },
  { name: "Settings", icon: "⚙️", path: "/settings" },
];

export function Sidebar({ onLogout }) {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const isSubmenuActive = (children) => {
    return children.some((child) => location.pathname === child.path);
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-md font-inter flex flex-col">
      <div className="px-6 py-5 text-2xl font-extrabold text-teal-700 tracking-wide border-b border-gray-100">
        Zevar Admin
      </div>
      <nav className="flex-1 px-4 pt-6">
        <ul className="space-y-2">
          {sidebarLinks.map((link) => (
            <li key={link.name}>
              {link.children ? (
                // Render submenu parent
                <div>
                  <button
                    onClick={() => toggleSubmenu(link.name)}
                    className={`flex items-center justify-between w-full gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-teal-100 cursor-pointer text-sm font-medium transition ${
                      isSubmenuActive(link.children)
                        ? "bg-teal-100 font-semibold"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{link.icon}</span>
                      {link.name}
                    </div>
                    <span
                      className={`text-xs transition-transform ${
                        expandedMenus[link.name] ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {/* Render submenu items */}
                  {expandedMenus[link.name] && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {link.children.map((child) => (
                        <li key={child.name}>
                          <Link
                            to={child.path}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-teal-50 cursor-pointer text-sm transition ${
                              location.pathname === child.path
                                ? "bg-teal-50 text-teal-700 font-semibold"
                                : ""
                            }`}
                          >
                            <span className="text-sm">•</span>
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // Render regular menu item
                <Link
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-teal-100 cursor-pointer text-sm font-medium transition ${
                    location.pathname === link.path ? "bg-teal-100 font-semibold" : ""
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.name}
                </Link>
              )}
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