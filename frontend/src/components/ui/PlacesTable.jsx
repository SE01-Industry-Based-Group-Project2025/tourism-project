// src/components/ui/PlacesTable.jsx
import React from 'react';

const PlacesTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-3 px-6 text-left">Destination</th>
            <th className="py-3 px-6 text-left">Region</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((place, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="py-3 px-6">{place.name}</td>
                <td className="py-3 px-6">{place.region}</td>
                <td className="py-3 px-6 text-center space-x-4">
                  <button
                    onClick={() => onEdit(place)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(place)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-4 px-6 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PlacesTable;
