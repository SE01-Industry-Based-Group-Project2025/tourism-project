import React from "react";
import { Input } from "../ui/Input";

export default function TourFilterBar(props) {
  const {
    searchValue,
    onSearchChange,
    statusValue,
    onStatusChange,
    typeValue,
    onTypeChange,
  } = props;

  return(
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 p-6 bg-white rounded-lg shadow-sm">
        {/* Search Input */}
        <Input 
          placeholder="Search Tour Name..." 
          value={searchValue} 
          onChange={onSearchChange}
          className="w-full md:w-1/3"
        />

        {/* Status Select */}
        <select 
          value={statusValue} 
          onChange={onStatusChange} 
          className="w-full md:w-auto border border-gray-300 bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        
        {/* Type Select */}
        <select 
          value={typeValue} 
          onChange={onTypeChange} 
          className="w-full md:w-auto border border-gray-300 bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="adventure">Adventure</option>
          <option value="cultural">Cultural</option>
          <option value="beach">Beach</option>
          <option value="wildlife">Wildlife</option>
        </select>
    </div>
  );
}