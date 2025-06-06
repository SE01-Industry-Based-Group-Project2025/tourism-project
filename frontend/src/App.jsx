// src/App.jsx

import React from "react";
import AdminLayout from "./components/layouts/AdminLayout";

export default function App() {
  return (
    <AdminLayout>
      {/* This is the “main content” that appears under the header, to the right of the sidebar */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Welcome to the Admin Panel</h2>
        <p className="text-gray-700">
          This is a placeholder. Later, your ManageToursPage (with the table, filters, etc.) will go here.
        </p>
        {/* To show scrolling under the header, add filler text */}
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="text-gray-600">
            Placeholder content line {i + 1}
          </p>
        ))}
      </div>
    </AdminLayout>
  );
}
