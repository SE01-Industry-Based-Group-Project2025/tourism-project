// src/components/tours/PaginationControls.jsx
import React from "react";
import { Button } from "../ui/Button";

export default function PaginationControls({ currentPage, totalPages, onPrevious, onNext }) {
  return (
    <div className="flex justify-end space-x-2 mt-6">
      <Button
        variant="secondary"
        className={`px-6 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary
          ${currentPage <= 1 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600 text-white"}`}
        onClick={onPrevious}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>
      <Button
        variant="secondary"
        className={`px-6 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary
          ${currentPage >= totalPages ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600 text-white"}`}
        onClick={onNext}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  );
}
