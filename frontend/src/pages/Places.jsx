import React, { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import StatsCard from '../components/ui/StatsCard';
import ContentCard from '../components/ui/ContentCard';
import Tabs from '../components/ui/Tabs';
import RegionFilter from '../components/ui/RegionFilter';
import SearchBar from '../components/ui/SearchBar';
import PlacesTable from '../components/ui/PlacesTable';
import NewDestinationButton from '../components/ui/NewDestinationButton';
import DestinationFormModal from '../components/ui/DestinationFormModal';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';
import PaginationControls from '../components/ui/PaginationControls';

const dummyData = [
  { name: 'Ella', region: 'Hill Country' },
  { name: 'Galle', region: 'Southern' },
  { name: 'Kandy', region: 'Central' },
  { name: 'Sigiriya', region: 'Central' },
  { name: 'Mirissa', region: 'Southern' },
  { name: 'Nuwara Eliya', region: 'Hill Country' },
  { name: 'Trincomalee', region: 'Eastern' },
];

const dummyActivities = [
  { name: 'Hiking', region: 'Hill Country' },
  { name: 'Surfing', region: 'Southern' },
  { name: 'Temple Visit', region: 'Central' },
];

const Places = () => {
  const [activeTab, setActiveTab] = useState('Destinations');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [searchTerm, setSearchTerm] = useState('');
  const [destinations, setDestinations] = useState(dummyData);
  const [activities, setActivities] = useState(dummyActivities);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editType, setEditType] = useState('destination');
  const [deleteType, setDeleteType] = useState('destination');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRegion, searchTerm, activeTab]);

  const activeData = activeTab === 'Destinations' ? destinations : activities;
  const setActiveData = activeTab === 'Destinations' ? setDestinations : setActivities;

  const filteredData = activeData.filter((item) => {
    const matchRegion =
      selectedRegion === 'All Regions' || item.region === selectedRegion;
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchRegion && matchSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (item) => {
    setEditType(activeTab === 'Destinations' ? 'destination' : 'activity');
    setEditData(item);
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setDeleteType(activeTab === 'Destinations' ? 'destination' : 'activity');
    setDeleteTarget(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = (item) => {
    const data = deleteType === 'destination' ? destinations : activities;
    const setter = deleteType === 'destination' ? setDestinations : setActivities;

    const updated = data.filter(
      (p) => p.name !== item.name || p.region !== item.region
    );
    setter(updated);
    setDeleteTarget(null);
    setShowDeleteConfirm(false);
  };

  const handleAddOrUpdate = (updatedItem) => {
    const data = editType === 'destination' ? destinations : activities;
    const setter = editType === 'destination' ? setDestinations : setActivities;

    if (editData) {
      const updatedList = data.map((p) =>
        p.name === editData.name && p.region === editData.region
          ? updatedItem
          : p
      );
      setter(updatedList);
    } else {
      setter([...data, updatedItem]);
    }

    setShowModal(false);
    setEditData(null);
  };  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="space-y-8 p-6">
        {/* Header */}
        <PageHeader
          title="Places Management"
          subtitle="Manage destinations and activities across Sri Lanka"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        />

        {/* Stats Cards */}        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatsCard
            title="Total Destinations"
            value={destinations.length.toString()}
            color="blue"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          />
          <StatsCard
            title="Total Activities"
            value={activities.length.toString()}
            color="green"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          />
          <StatsCard
            title="Popular Regions"
            value="5"
            color="purple"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            )}
          />
          <StatsCard
            title="Recent Updates"
            value="12"
            color="yellow"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          />
        </div>

        {/* Tabs */}
        <ContentCard noPadding>
          <div className="p-8">
            <Tabs activeTab={activeTab} onChange={setActiveTab} />
          </div>
        </ContentCard>

        {/* Controls */}
        <ContentCard>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Search & Filter</h3>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <RegionFilter
              selectedRegion={selectedRegion}
              onChange={setSelectedRegion}
            />
            <div className="flex-1 w-full sm:w-auto">
              <SearchBar searchTerm={searchTerm} onChange={setSearchTerm} />
            </div>
            <NewDestinationButton
              onClick={() => {
                setEditType(activeTab === 'Destinations' ? 'destination' : 'activity');
                setShowModal(true);
              }}
            >
              {activeTab === 'Destinations' ? '+ New Destination' : '+ New Activity'}
            </NewDestinationButton>
          </div>
        </ContentCard>

        {/* Table */}
        <ContentCard noPadding>
          <PlacesTable
            data={paginatedData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </ContentCard>

        {/* Pagination */}
        <div className="flex justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          />
        </div>

        {/* Modals */}
        <DestinationFormModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditData(null);
          }}
          onSubmit={handleAddOrUpdate}
          initialData={editData}
          type={editType}
        />

        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          item={deleteTarget}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          type={deleteType}
        />
      </div>
    </div>
  );
};

export default Places;
