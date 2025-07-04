import React from "react";
import { AdminLayout } from "../components/layouts/AdminLayout";

export default function Users() {
  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <p>This is the Users page.</p>
      </div>
    </AdminLayout>
  );
}