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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isDestination ? 'Destination' : 'Activity'} Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
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
