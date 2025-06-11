import React from "react";

export default function Dashboard() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
      <p className="text-gray-600">Welcome to the SLTOURPAL Admin Dashboard</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded">
          <h3 className="font-semibold">Total Tours</h3>
          <p className="text-2xl">24</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded">
          <h3 className="font-semibold">Active Bookings</h3>
          <p className="text-2xl">156</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded">
          <h3 className="font-semibold">Total Revenue</h3>
          <p className="text-2xl">$45,632</p>
        </div>
      </div>
    </div>
  );
}
