// src/App.jsx
import React from "react";
import AdminSidebar from "./components/layouts/AdminSidebar";

export default function App() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-100 p-6">
        <p className="text-gray-700">Sidebar Test</p>
      </div>
    </div>
  );
}
