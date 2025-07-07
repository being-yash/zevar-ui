import React from "react";
import SidebarNav from "./SidebarNav";

export default function AppShellSidebar({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav />
      <main className="flex-1 p-6 sm:p-8">{children}</main>
    </div>
  );
}
