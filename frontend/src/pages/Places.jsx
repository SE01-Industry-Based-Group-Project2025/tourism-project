import React from "react";

export default function Places() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Places Management</h1>
      <p className="text-gray-600">Discover and manage amazing places to visit!</p>
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold">Sigiriya Rock</h3>
            <p className="text-sm text-gray-600 mt-2">Ancient rock fortress</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold">Kandy Temple</h3>
            <p className="text-sm text-gray-600 mt-2">Sacred Buddhist site</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold">Galle Fort</h3>
            <p className="text-sm text-gray-600 mt-2">Historic fortress</p>
          </div>
        </div>
      </div>
    </div>
  );
}