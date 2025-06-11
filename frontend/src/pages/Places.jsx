import React, { useState, useEffect } from 'react';
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
  };

  return (
    <div>
      

      <h2 className="text-3xl font-semibold mb-4 px-6 mt-4">
        {activeTab === 'Destinations' ? 'Place Management' : 'Activity Management'}
      </h2>
      <Tabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex items-center gap-4 mb-6 px-6">
        <RegionFilter
          selectedRegion={selectedRegion}
          onChange={setSelectedRegion}
        />
        <div className="flex-1">
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

      <div className="px-6">
        <PlacesTable
          data={paginatedData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        />
      </div>

      <DestinationFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditData(null);
        }}
        onSubmit={handleAddOrUpdate}
        initialData={editData}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        item={deleteTarget}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Places;
