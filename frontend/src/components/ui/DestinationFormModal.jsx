import React, { useEffect, useState } from 'react';

const DestinationFormModal = ({ isOpen, onClose, onSubmit, initialData, type = 'destination' }) => {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');

  const regions = [
    'Hill Country', 'Southern', 'Central', 'Eastern', 'Northern',
    'Western', 'North Central', 'North Western', 'Sabaragamuwa', 'Uva'
  ];

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRegion(initialData.region);
    } else {
      setName('');
      setRegion('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !region) return;
    onSubmit({ name: name.trim(), region });
    setName('');
    setRegion('');
    onClose();
  };

  if (!isOpen) return null;

  const isDestination = type === 'destination';
  const title = initialData 
    ? `Edit ${isDestination ? 'Destination' : 'Activity'}` 
    : `Add New ${isDestination ? 'Destination' : 'Activity'}`;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="p-6 border-b border-gradient-to-r from-blue-100 to-purple-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{title}</h2>
          </div>
        </div>        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {isDestination ? 'Destination' : 'Activity'} Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-gray-50/50 transition-all duration-200"
              placeholder={`Enter ${isDestination ? 'destination' : 'activity'} name...`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-gray-50/50 transition-all duration-200"
              required
            >
              <option value="">Select a region</option>
              {regions.map((regionOption) => (
                <option key={regionOption} value={regionOption}>
                  {regionOption}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!name.trim() || !region}
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DestinationFormModal;
