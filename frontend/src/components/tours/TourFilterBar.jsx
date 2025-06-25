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
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
        {/* Search Input */}
        <div className="w-full md:w-1/3 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <Input 
            placeholder="Search Tour Name..." 
            value={searchValue} 
            onChange={onSearchChange}
            className="w-full pl-16 pr-4 py-4 border-2 border-blue-100 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 focus:shadow-xl transition-all duration-300 placeholder-gray-500 text-gray-900 font-medium hover:shadow-lg"
          />
        </div>

        {/* Status Select */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <select 
            value={statusValue} 
            onChange={onStatusChange} 
            className="w-full md:w-auto pl-16 pr-12 py-4 border-2 border-green-100 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-300 focus:shadow-xl transition-all duration-300 appearance-none cursor-pointer text-gray-900 font-medium hover:shadow-lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <div className="p-2 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl shadow-sm">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Type Select */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <select 
            value={typeValue} 
            onChange={onTypeChange} 
            className="w-full md:w-auto pl-16 pr-12 py-4 border-2 border-purple-100 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-300 focus:shadow-xl transition-all duration-300 appearance-none cursor-pointer text-gray-900 font-medium hover:shadow-lg"
          >
            <option value="all">All Types</option>
            <option value="adventure">Adventure</option>
            <option value="cultural">Cultural</option>
            <option value="beach">Beach</option>
            <option value="wildlife">Wildlife</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <div className="p-2 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl shadow-sm">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
    </div>
  );
}