// src/pages/Tours.jsx
import React, { useState, useMemo } from "react";
import TourCardHeader from "../components/tours/TourCardHeader";
import TourFilterBar from "../components/tours/TourFilterBar";
import TourTable from "../components/tours/TourTable";
import PaginationControls from "../components/tours/PaginationControls";

// Static tour data
const toursData = [
  {
    id: 1,
    title: "Cultural Heritage Tour",
    description: "Explore ancient temples and cultural sites",
    duration: "7 days",
    price: "$1,200",
    status: "active",
    type: "cultural",
    rating: 4.8,
    participants: 25
  },
  {
    id: 2,
    title: "Beach Paradise Package",
    description: "Relax on pristine beaches with water sports",
    duration: "5 days",
    price: "$850",
    status: "active",
    type: "beach",
    rating: 4.6,
    participants: 18
  },
  {
    id: 3,
    title: "Adventure Mountain Trek",
    description: "Hiking and mountaineering experience",
    duration: "4 days",
    price: "$950",
    status: "inactive",
    type: "adventure",
    rating: 4.9,
    participants: 12
  },
  {
    id: 4,
    title: "Wildlife Safari Experience",
    description: "Explore national parks and wildlife",
    duration: "6 days",
    price: "$1,100",
    status: "active",
    type: "wildlife",
    rating: 4.7,
    participants: 20
  },
  {
    id: 5,
    title: "Tea Country Discovery",
    description: "Visit tea plantations and processing centers",
    duration: "3 days",
    price: "$650",
    status: "active",
    type: "cultural",
    rating: 4.5,
    participants: 15
  }
];

export default function Tours() {
  // Filter & pagination state
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("all");
  const [typeValue, setTypeValue] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handlers
  const handleView = (id) => {
    console.log("View", id);
    // TODO: navigate to `/admin/tours/${id}`
  };
  const handleEdit = (id) => {
    console.log("Edit", id);
    // TODO: navigate to `/admin/tours/${id}/edit`
  };
  // Filter data
  const filtered = useMemo(() => {
    return toursData
      .filter((t) =>
        t.title.toLowerCase().includes(searchValue.toLowerCase())
      )
      .filter((t) =>
        statusValue === "all" ? true : t.status === statusValue
      )
      .filter((t) =>
        typeValue === "all" ? true : t.type === typeValue
      );
  }, [searchValue, statusValue, typeValue]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  return (
    <div className="space-y-6">
      <TourCardHeader />

      <TourFilterBar
        searchValue={searchValue}
        onSearchChange={(e) => setSearchValue(e.target.value)}
        statusValue={statusValue}
        onStatusChange={(e) => setStatusValue(e.target.value)}
        typeValue={typeValue}
        onTypeChange={(e) => setTypeValue(e.target.value)}
      />

      <TourTable tours={paginated} onView={handleView} onEdit={handleEdit} />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
      />
    </div>
  );
}
