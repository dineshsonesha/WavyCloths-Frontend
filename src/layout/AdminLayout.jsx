// src/layout/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <AdminNavbar />

      {/* Main content */}
      <div className="flex-1 bg-gray-50 p-4 md:p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
