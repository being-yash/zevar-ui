import React from "react";
import { NavLink } from "react-router-dom";

export default function SidebarNav(links) {
    const navLinks = links;
    return (
        <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
        <div className="p-6 font-bold text-xl text-teal-600">Zevar Admin</div>
        <nav className="flex-1 px-4 space-y-2">
            {navLinks.map((link) => (
            <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-sm font-medium ${
                    isActive
                    ? "bg-teal-100 text-teal-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
                }
            >
                <span>{link.icon}</span>
                <span>{link.name}</span>
            </NavLink>
            ))}
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
