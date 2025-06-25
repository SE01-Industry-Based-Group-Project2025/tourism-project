// src/pages/Tours.jsx
import React, { useState, useMemo } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatsCard from "../components/ui/StatsCard";
import ContentCard from "../components/ui/ContentCard";
import TourFilterBar from "../components/tours/TourFilterBar";
import TourTable from "../components/tours/TourTable";
import PaginationControls from "../components/tours/PaginationControls";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
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

  // Calculate statistics from tours data
  const activeTours = toursData.filter(tour => tour.status === 'active').length;
  const totalParticipants = toursData.reduce((sum, tour) => sum + tour.participants, 0);
  const averageRating = (toursData.reduce((sum, tour) => sum + tour.rating, 0) / toursData.length).toFixed(1);
  const totalRevenue = toursData.reduce((sum, tour) => sum + parseInt(tour.price.replace('$', '').replace(',', '')), 0);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="space-y-8 p-6">
        {/* Header */}
        <PageHeader
          title="Tours Management"
          subtitle="Manage tour packages and experiences across Sri Lanka"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          )}          action={
            <Button 
              onClick={() => navigate('/admin/tours/new')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Tour
            </Button>
          }
        />

        {/* Stats Cards */}        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatsCard
            title="Active Tours"
            value={activeTours.toString()}
            color="blue"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            )}
          />
          <StatsCard
            title="Total Participants"
            value={totalParticipants.toString()}
            color="green"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
          />
          <StatsCard
            title="Average Rating"
            value={averageRating}
            color="yellow"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            )}
          />
          <StatsCard
            title="Total Revenue"
            value={`$${(totalRevenue/1000).toFixed(1)}K`}
            color="purple"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          />
        </div>

        {/* Filters */}
        <ContentCard>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Search & Filter Tours</h3>
            </div>
          </div>
          <TourFilterBar
            searchValue={searchValue}
            onSearchChange={(e) => setSearchValue(e.target.value)}
            statusValue={statusValue}
            onStatusChange={(e) => setStatusValue(e.target.value)}
            typeValue={typeValue}
            onTypeChange={(e) => setTypeValue(e.target.value)}
          />
        </ContentCard>

        {/* Tours Table */}
        <ContentCard noPadding>
          <TourTable tours={paginated} onView={handleView} onEdit={handleEdit} />
        </ContentCard>        {/* Pagination */}
        <div className="flex justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          />        </div>
      </div>
    </div>
  );
}
