import React from "react";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { useTheme } from "../contexts/ThemeContext";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p className="mb-6">This is the Settings page.</p>
        <div className="flex items-center gap-4">
          <span className="font-medium">Theme:</span>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold transition"
          >
            {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          </button>
          <span className="ml-2 text-sm text-gray-500">
            Current: <b>{theme.charAt(0).toUpperCase() + theme.slice(1)}</b>
          </span>
        </div>
      </div>
    </AdminLayout>
  );
}