import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/Accordion';
import { Checkbox } from '../ui/Checkbox';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/Popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../ui/Dialog';
import { Badge } from '../ui/Badge';
import { ScrollArea } from '../ui/ScrollArea';
import { 
  PlusCircle, 
  Trash2, 
  UploadCloud, 
  DollarSign, 
  X as XIcon, 
  ChevronDown, 
  GripVertical, 
  Calendar, 
  Edit3, 
  ImagePlus,
  Building2
} from 'lucide-react';

const steps = [
  { id: 1, name: 'Basic Info' },
  { id: 2, name: 'Itinerary' },
  { id: 3, name: 'Accommodation' },
  { id: 4, name: 'Pricing & Availability' },
  { id: 5, name: 'Media & Summary' },
];

const regions = ["Central", "Coastal", "Hill Country", "Northern", "Southern", "Western", "Eastern", "North Central", "North Western", "Uva", "Sabaragamuwa"];
const tourCategories = [
  "Adventure", 
  "Cultural", 
  "Nature & Wildlife", 
  "Wellness & Spa", 
  "Historical", 
  "Culinary", 
  "Luxury", 
  "Beach Holidays", 
  "Spiritual Journeys",
  "Photography Tours",
  "Eco Tours",
  "Family Friendly",
  "Romantic Getaways",
  "Educational Tours",
  "Art & Craft Tours"
];
const durationUnits = ["Days", "Weeks", "Months"];
const difficultyLevels = ["Easy", "Moderate", "Challenging"];

const availableActivities = ["Hiking", "Snorkeling", "City Tour", "Cooking Class", "Museum Visit", "Wildlife Safari", "Cultural Show", "Yoga Session", "Kayaking", "Surfing", "Temple Visit", "Tea Plantation Tour"];

export default function AddNewTour({ onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Basic Info
  const [tourName, setTourName] = useState('');
  const [tourCategory, setTourCategory] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [durationUnit, setDurationUnit] = useState(durationUnits[0]);
  const [shortDescription, setShortDescription] = useState('');
  const [highlights, setHighlights] = useState(['']);
  const [difficulty, setDifficulty] = useState(difficultyLevels[0]);
  const [region, setRegion] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  
  // API Data
  const [availableActivitiesFromAPI, setAvailableActivitiesFromAPI] = useState([]);
  const [availablePlacesFromAPI, setAvailablePlacesFromAPI] = useState([]);
  // Itinerary
  const [itineraryDays, setItineraryDays] = useState([]);
  const [expandedAccordionItem, setExpandedAccordionItem] = useState(null);

  // Accommodation
  const [accommodations, setAccommodations] = useState([]);
  const [isAccommodationModalOpen, setIsAccommodationModalOpen] = useState(false);
  const [editingAccommodationId, setEditingAccommodationId] = useState(null);
  const [modalAccTitle, setModalAccTitle] = useState('');
  const [modalAccDesc, setModalAccDesc] = useState('');
  const [modalAccImages, setModalAccImages] = useState([]);

  // Pricing & Availability
  const [pricePerPerson, setPricePerPerson] = useState('');
  const [availableSpots, setAvailableSpots] = useState('');
  const [availabilityRanges, setAvailabilityRanges] = useState([]);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [currentRangeToEditId, setCurrentRangeToEditId] = useState(null);
  const [modalStartDate, setModalStartDate] = useState('');
  const [modalEndDate, setModalEndDate] = useState('');
  // Media & Summary
  const [uploadedImages, setUploadedImages] = useState([]);

  const { getAuthHeaders } = useAuth();
  const API_BASE = 'http://localhost:8080';
  const TOURS_API = `${API_BASE}/api/tours`;
  const ACTIVITY_API = `${API_BASE}/api/activities`;
  const PLACE_API = `${API_BASE}/api/places`;

  // Fetch data on component mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(`${ACTIVITY_API}/getAllActivity`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log('Fetched activities from API:', data); // Debug log
          if (data && data.length > 0) {
            setAvailableActivitiesFromAPI(data);
          }
        } else {
          console.warn('API request failed with status:', res.status);
        }
      } catch (err) {
        console.error('Failed to fetch activities:', err);
        // Keep dropdown empty if API fails
      }
    };

    const fetchPlaces = async () => {
      try {
        const res = await fetch(`${PLACE_API}/getAllPlace`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log('Fetched places from API:', data); // Debug log
          if (data && data.length > 0) {
            setAvailablePlacesFromAPI(data);
          }
        } else {
          console.warn('Places API request failed with status:', res.status);
        }
      } catch (err) {
        console.error('Failed to fetch places:', err);
        // Keep dropdown empty if API fails
      }
    };

    if (getAuthHeaders) {
      fetchActivities();
      fetchPlaces();
    }
  }, [getAuthHeaders]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddHighlight = () => setHighlights([...highlights, '']);
  const handleRemoveHighlight = (index) => setHighlights(highlights.filter((_, i) => i !== index));
  const handleHighlightChange = (index, value) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };
  const handleAddItineraryDay = () => {
    const newDayNumber = itineraryDays.length + 1;
    const newDay = {
      id: `day-${newDayNumber}-${Date.now()}`,
      title: `Day ${newDayNumber}: New Day Title`,
      description: 'Detailed plan for this day...',
      imagePreview: 'https://placehold.co/600x400.png',
      imageHint: 'travel landscape',
      selectedDestinations: [],
    };
    setItineraryDays(prevDays => [...prevDays, newDay]);
    // Auto-expand the newly added day
    setExpandedAccordionItem(newDay.id);
  };

  const handleRemoveItineraryDay = (idToRemove, event) => {
    event.stopPropagation(); 
    const updatedDays = itineraryDays.filter(day => day.id !== idToRemove);
    const renumberedDays = updatedDays.map((day, index) => {
      const currentTitleParts = day.title.split(': ');
      const customPart = currentTitleParts.length > 1 ? currentTitleParts.slice(1).join(': ') : 'New Day Title';
      return {
        ...day,
        title: `Day ${index + 1}: ${customPart}`
      };
    });
    setItineraryDays(renumberedDays);
  };
  const handleActivityToggle = (activity) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleActivityDropdownChange = (e) => {
    const activityName = e.target.value;
    setSelectedActivity(activityName); // Update the dropdown value
    if (activityName && !selectedActivities.includes(activityName)) {
      setSelectedActivities(prev => [...prev, activityName]);
      setSelectedActivity(''); // Reset dropdown after adding
    }
  };

  const handleRemoveActivity = (activityToRemove) => {
    setSelectedActivities(prev => prev.filter(a => a !== activityToRemove));
  };

  const handlePlaceDropdownChange = (e, dayId) => {
    const placeName = e.target.value;
    if (placeName) {
      setItineraryDays(prevDays =>
        prevDays.map(day =>
          day.id === dayId
            ? {
                ...day,
                selectedDestinations: day.selectedDestinations.includes(placeName)
                  ? day.selectedDestinations
                  : [...day.selectedDestinations, placeName]
              }
            : day
        )
      );
      // Reset dropdown
      e.target.value = '';
    }
  };

  const handleRemovePlace = (dayId, placeToRemove) => {
    setItineraryDays(prevDays =>
      prevDays.map(day =>
        day.id === dayId
          ? {
              ...day,
              selectedDestinations: day.selectedDestinations.filter(d => d !== placeToRemove)
            }
          : day
      )
    );
  };

  const processDayImage = (file, dayId) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setItineraryDays(prevDays =>
          prevDays.map(d =>
            d.id === dayId ? { ...d, imagePreview: reader.result, imageHint: 'custom image' } : d
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDayImageInputChange = (event, dayId) => {
    const file = event.target.files?.[0];
    processDayImage(file, dayId);
  };

  const handleImageDrop = (event, dayId) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    processDayImage(file, dayId);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
    
  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const handleRemoveDayImage = (dayId) => {
    setItineraryDays(prevDays =>
      prevDays.map(d =>
        d.id === dayId ? { ...d, imagePreview: 'https://placehold.co/600x400.png', imageHint: 'travel landscape' } : d
      )
    );
  };

  // Accommodation Modal Handlers
  const openAddAccommodationModal = () => {
    setEditingAccommodationId(null);
    setModalAccTitle('');
    setModalAccDesc('');
    setModalAccImages([]);
    setIsAccommodationModalOpen(true);
  };

  const openEditAccommodationModal = (acc) => {
    setEditingAccommodationId(acc.id);
    setModalAccTitle(acc.title);
    setModalAccDesc(acc.description);
    setModalAccImages(acc.images);
    setIsAccommodationModalOpen(true);
  };

  const handleModalAccImageChange = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newImagesPromises = filesArray.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({ preview: reader.result, file, hint: 'accommodation custom' });
          };
          reader.readAsDataURL(file);
        });
      });
      Promise.all(newImagesPromises).then(newImages => {
        setModalAccImages(prev => [...prev, ...newImages].slice(0, 5)); // Limit to 5 images
      });
    }
  };

  const handleRemoveModalAccImage = (indexToRemove) => {
    setModalAccImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSaveAccommodation = () => {
    if (!modalAccTitle.trim()) {
      alert("Accommodation title is required.");
      return;
    }
    if (editingAccommodationId) {
      setAccommodations(prevAccs =>
        prevAccs.map(acc =>
          acc.id === editingAccommodationId
            ? { ...acc, title: modalAccTitle, description: modalAccDesc, images: modalAccImages }
            : acc
        )
      );
    } else {
      const newAcc = {
        id: `acc-${Date.now()}`,
        title: modalAccTitle,
        description: modalAccDesc,
        images: modalAccImages,
      };
      setAccommodations(prevAccs => [...prevAccs, newAcc]);
    }
    setIsAccommodationModalOpen(false);
  };  const handleDeleteAccommodation = (accId, event) => {
    event.stopPropagation();
    setAccommodations(prevAccs => prevAccs.filter(acc => acc.id !== accId));
  };
  const handleAddAccommodation = () => {
    const newAccommodation = {
      id: `acc-${Date.now()}`,
      title: 'New Accommodation',
      description: 'Add description for this accommodation...',
      images: [],
    };
    setAccommodations(prevAccs => [...prevAccs, newAccommodation]);
  };

  const handleUpdateAccommodationField = (accId, field, value) => {
    setAccommodations(prevAccs =>
      prevAccs.map(acc =>
        acc.id === accId ? { ...acc, [field]: value } : acc
      )
    );
  };

  const handleAddAccommodationImage = async (accId, file) => {
    try {
      const imageData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ preview: reader.result, file, hint: 'accommodation custom' });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      setAccommodations(prevAccs =>
        prevAccs.map(acc =>
          acc.id === accId 
            ? { ...acc, images: [...acc.images, imageData] }
            : acc
        )
      );
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };

  const handleRemoveAccommodationImage = (accId, imageIndex) => {
    setAccommodations(prevAccs =>
      prevAccs.map(acc =>
        acc.id === accId 
          ? { ...acc, images: acc.images.filter((_, index) => index !== imageIndex) }
          : acc
      )
    );
  };

  // Pricing & Availability Handlers
  const openAddAvailabilityModal = () => {
    setCurrentRangeToEditId(null);
    setModalStartDate('');
    setModalEndDate('');
    setIsAvailabilityModalOpen(true);
  };

  const openEditAvailabilityModal = (range) => {
    setCurrentRangeToEditId(range.id);
    setModalStartDate(range.startDate);
    setModalEndDate(range.endDate);
    setIsAvailabilityModalOpen(true);
  };

  const handleSaveAvailabilityRange = () => {
    if (!modalStartDate || !modalEndDate) {
      alert("Both start and end dates are required.");
      return;
    }
    
    const startDate = new Date(modalStartDate);
    const endDate = new Date(modalEndDate);
    
    if (startDate >= endDate) {
      alert("End date must be after start date.");
      return;
    }

    if (currentRangeToEditId) {
      setAvailabilityRanges(prevRanges =>
        prevRanges.map(range =>
          range.id === currentRangeToEditId
            ? { ...range, startDate: modalStartDate, endDate: modalEndDate }
            : range
        )
      );
    } else {
      const newRange = {
        id: `range-${Date.now()}`,
        startDate: modalStartDate,
        endDate: modalEndDate,
      };
      setAvailabilityRanges(prevRanges => [...prevRanges, newRange]);
    }
    setIsAvailabilityModalOpen(false);
  };

  const handleDeleteAvailabilityRange = (rangeId) => {
    if (window.confirm('Are you sure you want to delete this availability range?')) {
      setAvailabilityRanges(prevRanges => prevRanges.filter(range => range.id !== rangeId));
    }
  };
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  // Media & Summary Handlers
  const handleMainImageUpload = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newImagesPromises = filesArray.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({ 
              id: `img-${Date.now()}-${Math.random()}`,
              preview: reader.result, 
              file, 
              name: file.name,
              size: file.size,
              isPrimary: uploadedImages.length === 0 // First image is primary
            });
          };
          reader.readAsDataURL(file);
        });
      });
      Promise.all(newImagesPromises).then(newImages => {
        setUploadedImages(prev => [...prev, ...newImages].slice(0, 10)); // Limit to 10 images
      });
    }
  };

  const handleRemoveImage = (imageId) => {
    setUploadedImages(prev => {
      const filteredImages = prev.filter(img => img.id !== imageId);
      // If we removed the primary image, make the first remaining image primary
      if (filteredImages.length > 0 && !filteredImages.some(img => img.isPrimary)) {
        filteredImages[0].isPrimary = true;
      }
      return filteredImages;
    });
  };

  const handleSetPrimaryImage = (imageId) => {
    setUploadedImages(prev =>
      prev.map(img => ({ ...img, isPrimary: img.id === imageId }))
    );
  };

  const handlePublish = async () => {
    // Debug log individual state values
    console.log('Publishing tour with values:', {
      tourName,
      tourCategory,
      durationValue,
      durationUnit,
      difficulty,
      region,
      selectedActivities,
    });

    const tourData = {
      name: tourName,
      category: tourCategory,
      durationValue: parseInt(durationValue),
      durationUnit: durationUnit.toUpperCase(),
      shortDescription,
      highlights: highlights.filter(h => h.trim()),
      difficulty,
      region,
      activities: selectedActivities,
      availableSpots: parseInt(availableSpots),
      status: "INCOMPLETE",
      isCustom: false,
      itineraryDays: itineraryDays.map((day, index) => ({
        dayNumber: index + 1,
        title: day.title,
        description: day.description,
        imageUrl: day.imagePreview === 'https://placehold.co/600x400.png' ? null : day.imagePreview,
        destinations: day.selectedDestinations
      })),
      accommodations: accommodations.map(acc => ({
        title: acc.title,
        description: acc.description,
        images: acc.images || []
      })),
      price: parseFloat(pricePerPerson) || 0.00,
      availabilityRanges: availabilityRanges.map(range => ({
        startDate: range.startDate,
        endDate: range.endDate
      })),
      images: uploadedImages.map(img => ({
        url: img.preview,
        isPrimary: img.isPrimary || false
      }))
    };

    console.log('Final tourData:', tourData);

    try {
      const res = await fetch(TOURS_API, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourData),
      });
      if (res.status === 403) {
        console.log(tourData);
        alert('You are not authorized to publish tours.');
        return;
      }
      if (!res.ok) throw new Error('Failed to publish tour');
      alert('Tour published successfully');
      if (onClose) onClose();
    } catch (err) {
      console.error('Publish tour error', err);
      alert('Error publishing tour');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateTourSummary = () => {
    return {
      basicInfo: {
        name: tourName,
        category: tourCategory,
        duration: `${durationValue} ${durationUnit.toLowerCase()}`,
        difficulty: difficulty,
        region: region,
        highlights: highlights.filter(h => h.trim()),
        activities: selectedActivities
      },
      itinerary: {
        totalDays: itineraryDays.length,
        destinations: [...new Set(itineraryDays.flatMap(day => day.selectedDestinations))]
      },
      accommodation: {
        totalOptions: accommodations.length,
        accommodationNames: accommodations.map(acc => acc.title)
      },
      pricing: {
        price: pricePerPerson ? `$${pricePerPerson}` : 'Not set',
        availableSpots: availableSpots || 'Not set'
      },
      availability: {
        totalPeriods: availabilityRanges.length,
        ranges: availabilityRanges.map(range => formatDateRange(range.startDate, range.endDate))
      },
      media: {
        totalImages: uploadedImages.length,
        hasPrimaryImage: uploadedImages.some(img => img.isPrimary)
      }
    };
  };  const ProgressIndicator = () => (
    <div className="mb-8">
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-blue-50/50 rounded-2xl border border-blue-100/50">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-blue-700 bg-clip-text text-transparent">
            Create New Tour
          </h1>
          <p className="text-gray-600 mt-2 font-medium">Build your perfect tour experience step by step</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 p-3 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <XIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-between bg-gray-50/50 p-6 rounded-2xl">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep >= step.id 
                    ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-110' 
                    : 'bg-white border-2 border-gray-200 text-gray-500 hover:border-blue-300'
                }`}
              >
                {currentStep > step.id ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <p className={`mt-3 text-xs font-semibold ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                {step.name}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-2 rounded-full mx-4 transition-all duration-500 ${
                currentStep > step.id ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );return (
    <div className="w-full">
      {/* Main Card - Full Width with Enhanced Skydash Styling */}
      <Card className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-gray-900/10 rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <ProgressIndicator />            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-50/80 via-purple-50/60 to-blue-50/80 p-6 rounded-2xl border border-blue-100/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Basic Information</h2>
                      <p className="text-gray-600 mt-1 font-medium">Let's start with the fundamentals of your tour</p>
                    </div>
                  </div>
                </div>                {/* Tour Name */}
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <Label className="text-sm font-bold text-gray-700 mb-3 block">
                    Tour Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g., 8-Day Sri Lankan Cultural Heritage Tour"
                    value={tourName}
                    onChange={(e) => setTourName(e.target.value)}
                    className="text-base bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                {/* Category and Duration */}
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-bold text-gray-700 mb-3 block">
                        Tour Category <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={tourCategory}
                        onChange={(e) => setTourCategory(e.target.value)}
                        className="bg-white/80 border-gray-200 focus:border-blue-500"
                      >
                        <option value="">Select category</option>
                        {tourCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-gray-700 mb-3 block">
                        Duration <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-3">
                        <Input
                          type="number"
                          placeholder="8"
                          value={durationValue}
                          onChange={(e) => setDurationValue(e.target.value)}
                          className="flex-1 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-center font-semibold"
                          min="1"
                          step="1"
                        />
                        <Select
                          value={durationUnit}
                          onChange={(e) => setDurationUnit(e.target.value)}
                          className="flex-1 bg-white/80 border-gray-200 focus:border-blue-500"
                        >
                          {durationUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Short Description */}
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <Label className="text-sm font-bold text-gray-700 mb-3 block">Short Description</Label>
                  <Textarea
                    rows={3}
                    placeholder="A brief overview of the tour (max 200 characters)"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    {shortDescription.length}/200 characters
                  </p>
                </div>

                {/* Tour Highlights */}
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <Label className="text-sm font-bold text-gray-700 mb-4 block">Tour Highlights</Label>                  <div className="space-y-3">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Input
                          value={highlight}
                          onChange={(e) => handleHighlightChange(index, e.target.value)}
                          placeholder={`Highlight ${index + 1}`}
                          className="flex-1 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveHighlight(index)}
                          className="text-gray-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 p-2 rounded-xl transition-all duration-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddHighlight}
                    className="mt-4 text-blue-600 border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-400 transition-all duration-300 rounded-xl"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Highlight
                  </Button>
                </div>

                {/* Difficulty Level */}
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <Label className="text-sm font-bold text-gray-700 block">Difficulty Level</Label>
                  <Select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="bg-white/80 border-gray-200 focus:border-blue-500"
                  >
                    {difficultyLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </Select>
                </div>                {/* Region */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Region</Label>
                  <Select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="bg-white/80 border-gray-200 focus:border-blue-500"
                  >
                    <option value="">Select region</option>
                    {regions.map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </Select>
                </div>

                {/* Activities */}
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <Label className="text-sm font-bold text-gray-700 block">Activities</Label>
                  
                  {/* Activity Dropdown */}
                  <div className="space-y-3">
                    <Select
                      value={selectedActivity}
                      onChange={handleActivityDropdownChange}
                      className="bg-white/80 border-gray-200 focus:border-blue-500"
                    >
                      <option value="">
                        {availableActivitiesFromAPI.length === 0 ? 'No activities available' : 'Select an activity to add'}
                      </option>
                      {availableActivitiesFromAPI.map(activity => (
                        <option 
                          key={activity.id || activity.name} 
                          value={activity.name}
                          disabled={selectedActivities.includes(activity.name)}
                        >
                          {activity.name}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {/* Selected Activities */}
                  {selectedActivities.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">Selected Activities</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedActivities.map(activity => (
                          <Badge key={activity} variant="secondary" className="bg-blue-100 text-blue-700 px-3 py-1">
                            {activity}
                            <button
                              type="button"
                              className="ml-2 hover:text-blue-900 font-bold"
                              onClick={() => handleRemoveActivity(activity)}
                            >
                              <XIcon className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Itinerary */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Day-by-Day Itinerary</h2>
                  <p className="text-gray-600 mt-1">Plan the perfect journey for your guests</p>
                </div>

                {/* Add Day Button */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Itinerary Days</h3>
                    <p className="text-sm text-gray-600">Create detailed plans for each day of your tour</p>
                  </div>
                  <Button
                    onClick={handleAddItineraryDay}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-500/25"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Day
                  </Button>
                </div>

                {/* Days List */}                {itineraryDays.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No itinerary days yet</h3>
                    <p className="text-gray-500 mb-6">Start building your tour by adding the first day</p>
                    <Button
                      onClick={handleAddItineraryDay}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add First Day
                    </Button>
                  </div>
                ) : (
                  <Accordion 
                    type="single" 
                    collapsible 
                    className="space-y-4"
                    value={expandedAccordionItem}
                    onValueChange={setExpandedAccordionItem}
                  >
                    {itineraryDays.map((day, dayIndex) => (
                      <AccordionItem 
                        key={day.id} 
                        value={day.id} 
                        className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg shadow-gray-900/5 overflow-hidden"
                      >
                        <AccordionTrigger className="px-6 py-4 hover:bg-gray-50/80 transition-all duration-200">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                              <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                              <div className="text-left">
                                <h4 className="font-semibold text-gray-900">{day.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {day.selectedDestinations.length > 0 
                                    ? `Destinations: ${day.selectedDestinations.join(', ')}` 
                                    : 'No destinations selected'
                                  }
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleRemoveItineraryDay(day.id, e)}
                              className="text-gray-500 hover:text-red-500 hover:bg-red-50 ml-4"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="space-y-6">
                            {/* Day Title */}
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-gray-700">Day Title</Label>
                              <Input
                                value={day.title}
                                onChange={(e) => {
                                  const newDays = [...itineraryDays];
                                  newDays[dayIndex].title = e.target.value;
                                  setItineraryDays(newDays);
                                }}
                                placeholder="e.g., Arrival in Kandy & Temple of the Tooth"
                                className="text-base"
                              />
                            </div>

                            {/* Day Description */}
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-gray-700">Description</Label>
                              <Textarea
                                value={day.description}
                                onChange={(e) => {
                                  const newDays = [...itineraryDays];
                                  newDays[dayIndex].description = e.target.value;
                                  setItineraryDays(newDays);
                                }}
                                placeholder="Detailed plan for this day including activities, meals, and experiences..."
                                rows={4}
                              />
                            </div>

                            {/* Destinations */}
                            <div className="space-y-3">
                              <Label className="text-sm font-semibold text-gray-700">Places</Label>
                              
                              {/* Place Dropdown */}
                              <div className="space-y-3">
                                <Select
                                  onChange={(e) => handlePlaceDropdownChange(e, day.id)}
                                  className="bg-white/80 border-gray-200 focus:border-blue-500"
                                >
                                  <option value="">
                                    {availablePlacesFromAPI.length === 0 ? 'No places available' : 'Select a place to add'}
                                  </option>
                                  {availablePlacesFromAPI.map(place => (
                                    <option 
                                      key={place.id || place.name} 
                                      value={place.name}
                                      disabled={day.selectedDestinations.includes(place.name)}
                                    >
                                      {place.name}
                                    </option>
                                  ))}
                                </Select>
                              </div>

                              {/* Selected Places */}
                              {day.selectedDestinations.length > 0 && (
                                <div className="space-y-3">
                                  <Label className="text-sm font-semibold text-gray-700">Selected Places</Label>
                                  <div className="flex flex-wrap gap-2">
                                    {day.selectedDestinations.map(dest => (
                                      <Badge key={dest} variant="secondary" className="bg-indigo-100 text-indigo-700 px-3 py-1">
                                        {dest}
                                        <button
                                          type="button"
                                          className="ml-2 hover:text-indigo-900 font-bold"
                                          onClick={() => handleRemovePlace(day.id, dest)}
                                        >
                                          <XIcon className="h-3 w-3" />
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Day Image Upload */}
                            <div className="space-y-3">
                              <Label className="text-sm font-semibold text-gray-700">Day Image</Label>
                              <div className="relative">
                                {day.imagePreview === 'https://placehold.co/600x400.png' ? (
                                  <div 
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200"
                                    onClick={() => document.getElementById(`day-image-upload-${day.id}`)?.click()}
                                    onDrop={(e) => handleImageDrop(e, day.id)}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                  >
                                    <UploadCloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-gray-600 mb-2">Upload Day Image</h4>
                                    <p className="text-gray-500 mb-2">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                  </div>
                                ) : (
                                  <div className="relative group rounded-xl overflow-hidden">
                                    <img 
                                      src={day.imagePreview} 
                                      alt={`Preview for ${day.title}`}
                                      className="w-full h-64 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => document.getElementById(`day-image-upload-${day.id}`)?.click()}
                                        className="bg-white/90 text-gray-900 hover:bg-white"
                                      >
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Change
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRemoveDayImage(day.id)}
                                        className="bg-red-500/90 text-white border-red-500 hover:bg-red-600"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                <input
                                  type="file"
                                  id={`day-image-upload-${day.id}`}
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleDayImageInputChange(e, day.id)}
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>                )}
              </div>
            )}

            {/* Step 3: Accommodation */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Accommodation Details</h2>
                  <p className="text-gray-600 mt-1">Add hotels, lodges, and other accommodation options</p>
                </div>

                {/* Add Accommodation Button */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Accommodation Options</h3>
                    <p className="text-sm text-gray-600">Manage hotels, resorts, and lodging for your tour</p>
                  </div>                  <Button
                    onClick={handleAddAccommodation}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-500/25"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Accommodation
                  </Button>
                </div>                {/* Accommodations List */}
                {accommodations.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">🏨</div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No accommodations added yet</h3>
                    <p className="text-gray-500 mb-6">Start by adding hotels, resorts, or other lodging options</p>                    <Button
                      onClick={handleAddAccommodation}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add First Accommodation
                    </Button>
                  </div>
                ) : (
                  <Accordion 
                    type="single" 
                    collapsible 
                    className="space-y-4"
                  >
                    {accommodations.map((acc) => (
                      <AccordionItem 
                        key={acc.id} 
                        value={acc.id} 
                        className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg shadow-gray-900/5 overflow-hidden"
                      >
                        <AccordionTrigger className="px-6 py-4 hover:bg-gray-50/80 transition-all duration-200">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                              <Building2 className="h-5 w-5 text-gray-400" />
                              <div className="text-left">
                                <h4 className="font-semibold text-gray-900">{acc.title}</h4>
                                <p className="text-sm text-gray-500 truncate max-w-md">
                                  {acc.description || "No description"}
                                </p>
                              </div>                            </div>                            <div className="flex items-center gap-2">
                              {acc.images.length > 0 && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                                  {acc.images.length} image{acc.images.length !== 1 ? 's' : ''}
                                </span>
                              )}                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleDeleteAccommodation(acc.id, e)}
                                className="text-gray-500 hover:text-red-500 hover:bg-red-50 ml-4"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </AccordionTrigger>                        <AccordionContent className="px-6 pb-6">
                          <div className="space-y-6">
                            {/* Title Field */}
                            <div>
                              <Label htmlFor={`acc-title-${acc.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                                Accommodation Title
                              </Label>
                              <Input
                                id={`acc-title-${acc.id}`}
                                value={acc.title}
                                onChange={(e) => handleUpdateAccommodationField(acc.id, 'title', e.target.value)}
                                placeholder="Enter accommodation name"
                                className="w-full"
                              />
                            </div>

                            {/* Description Field */}
                            <div>
                              <Label htmlFor={`acc-desc-${acc.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                              </Label>
                              <Textarea
                                id={`acc-desc-${acc.id}`}
                                value={acc.description}
                                onChange={(e) => handleUpdateAccommodationField(acc.id, 'description', e.target.value)}
                                placeholder="Enter accommodation description"
                                rows={3}
                                className="w-full"
                              />
                            </div>
                            
                            {/* Images Section */}
                            <div>
                              <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Images
                              </Label>
                              
                              {/* Upload Button */}
                              <div className="mb-4">
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => {
                                    Array.from(e.target.files).forEach(file => {
                                      handleAddAccommodationImage(acc.id, file);
                                    });
                                  }}
                                  className="hidden"
                                  id={`acc-upload-${acc.id}`}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => document.getElementById(`acc-upload-${acc.id}`).click()}
                                  className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400 h-32 flex flex-col items-center justify-center text-gray-500 hover:text-gray-600"
                                >
                                  <UploadCloud className="h-8 w-8 mb-2" />
                                  <span>Click to upload images</span>
                                  <span className="text-xs">PNG, JPG, GIF up to 10MB</span>
                                </Button>
                              </div>

                              {/* Image Grid */}
                              {acc.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {acc.images.map((image, index) => (
                                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 group">
                                      <img 
                                        src={image.preview} 
                                        alt={`${acc.title} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveAccommodationImage(acc.id, index)}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <XIcon className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}

                {/* Accommodation Modal */}
                <Dialog open={isAccommodationModalOpen} onOpenChange={setIsAccommodationModalOpen}>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                    <div className="p-6">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                          {editingAccommodationId ? 'Edit' : 'Add New'} Accommodation
                        </DialogTitle>
                        <p className="text-gray-600 mt-2">
                          Provide details and images for this accommodation option
                        </p>
                      </DialogHeader>                      <div className="space-y-6">
                        {/* Accommodation Title */}
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700">
                            Accommodation Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={modalAccTitle}
                            onChange={e => setModalAccTitle(e.target.value)}
                            placeholder="e.g., Seaside Boutique Hotel, Mountain Lodge"
                            className="text-base"
                          />
                        </div>

                        {/* Accommodation Description */}
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700">Description</Label>
                          <Textarea
                            value={modalAccDesc}
                            onChange={e => setModalAccDesc(e.target.value)}
                            placeholder="Describe the accommodation, amenities, location, and what makes it special..."
                            rows={4}
                          />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-4">
                          <Label className="text-sm font-semibold text-gray-700">
                            Images <span className="text-xs text-gray-500">(up to 5 images)</span>
                          </Label>
                          
                          {/* Upload Area */}
                          <div 
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200"
                            onClick={() => document.getElementById('accommodation-image-upload')?.click()}
                          >
                            <ImagePlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-gray-600 mb-2">Upload Accommodation Images</h4>
                            <p className="text-gray-500 mb-2">Click to upload or drag and drop multiple images</p>
                            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB each</p>
                          </div>
                          
                          <input
                            type="file"
                            id="accommodation-image-upload"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleModalAccImageChange}
                          />

                          {/* Image Preview Grid */}
                          {modalAccImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                              {modalAccImages.map((img, index) => (
                                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden">
                                  <img 
                                    src={img.preview} 
                                    alt={`Accommodation image ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveModalAccImage(index)}
                                      className="bg-red-500/90 text-white hover:bg-red-600 h-8 w-8 p-0 rounded-full"
                                    >
                                      <XIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {index + 1}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <DialogFooter className="flex gap-3 pt-6 mt-6 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setIsAccommodationModalOpen(false)}
                          className="px-6"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveAccommodation}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6"
                        >
                          {editingAccommodationId ? 'Update' : 'Add'} Accommodation
                        </Button>
                      </DialogFooter>
                    </div>
                  </DialogContent>                </Dialog>
              </div>
            )}            {/* Step 4: Pricing & Availability */}
            {currentStep === 4 && (
              <div className="space-y-10">
                <div className="bg-gradient-to-r from-blue-50/80 via-purple-50/60 to-blue-50/80 p-6 rounded-2xl border border-blue-100/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Pricing & Availability</h2>
                      <p className="text-gray-600 mt-1 font-medium">Set your tour price, available spots, and booking periods</p>
                    </div>
                  </div>
                </div>

                {/* Pricing & Capacity Section */}
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tour Pricing */}
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-gray-700">
                        Price Per Person (USD) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="number"
                          placeholder="299"
                          value={pricePerPerson}
                          onChange={(e) => setPricePerPerson(e.target.value)}
                          className="pl-12 text-lg font-medium bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Fixed rate charged per person for this tour
                      </p>
                    </div>

                    {/* Available Spots */}
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-gray-700">
                        Available Spots <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="12"
                        value={availableSpots}
                        onChange={(e) => setAvailableSpots(e.target.value)}
                        className="text-lg font-medium bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm"
                        min="1"
                      />
                      <p className="text-xs text-gray-500">
                        Total number of participants allowed for this tour
                      </p>
                    </div>
                  </div>
                </div>

                {/* Availability Ranges */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Availability Periods</h3>
                      <p className="text-sm text-gray-600">Define when this tour is available for booking</p>
                    </div>
                    <Button
                      onClick={openAddAvailabilityModal}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Add Date Range
                    </Button>
                  </div>

                  {availabilityRanges.length === 0 ? (
                    <div className="text-center py-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-dashed border-amber-300">
                      <div className="text-6xl mb-4">📅</div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No availability periods set</h3>
                      <p className="text-gray-500 mb-6">Add date ranges when this tour will be available</p>
                      <Button
                        onClick={openAddAvailabilityModal}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Add First Date Range
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {availabilityRanges.map(range => (
                        <Card key={range.id} className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg shadow-gray-900/5 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 rounded-full">
                                  <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{formatDateRange(range.startDate, range.endDate)}</h4>
                                  <p className="text-sm text-gray-600">
                                    {Math.ceil((new Date(range.endDate) - new Date(range.startDate)) / (1000 * 60 * 60 * 24))} days available
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditAvailabilityModal(range)}
                                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 h-8 w-8 p-0 rounded-full"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAvailabilityRange(range.id)}
                                  className="text-gray-600 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Availability Modal */}
                <Dialog open={isAvailabilityModalOpen} onOpenChange={setIsAvailabilityModalOpen}>
                  <DialogContent className="max-w-lg">
                    <div className="p-6">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                          {currentRangeToEditId ? 'Edit' : 'Add New'} Availability Period
                        </DialogTitle>
                        <p className="text-gray-600 mt-2">
                          Set the start and end dates for this availability period
                        </p>
                      </DialogHeader>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700">
                            Start Date <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="date"
                            value={modalStartDate}
                            onChange={(e) => setModalStartDate(e.target.value)}
                            className="text-base"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700">
                            End Date <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="date"
                            value={modalEndDate}
                            onChange={(e) => setModalEndDate(e.target.value)}
                            className="text-base"
                          />
                        </div>

                        {modalStartDate && modalEndDate && (
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-900">
                              Duration: {Math.ceil((new Date(modalEndDate) - new Date(modalStartDate)) / (1000 * 60 * 60 * 24))} days
                            </p>
                          </div>
                        )}
                      </div>

                      <DialogFooter className="flex gap-3 pt-6 mt-6 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setIsAvailabilityModalOpen(false)}
                          className="px-6"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveAvailabilityRange}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6"
                        >
                          {currentRangeToEditId ? 'Update' : 'Add'} Date Range
                        </Button>
                      </DialogFooter>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Step 5: Media & Summary */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Media & Summary</h2>
                  <p className="text-gray-600 mt-1">Upload images, set SEO details, and review your tour</p>
                </div>

                {/* Image Gallery Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Tour Image Gallery</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload high-quality images that showcase your tour experience</p>
                  </div>

                  {/* Image Upload Area */}
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100"
                    onClick={() => document.getElementById('main-image-upload')?.click()}
                  >
                    <div className="space-y-4">
                      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                        <ImagePlus className="h-10 w-10 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-700 mb-2">Upload Tour Images</h4>
                        <p className="text-gray-600 mb-2">Drag and drop multiple images or click to browse</p>
                        <p className="text-sm text-gray-500">PNG, JPG, WebP up to 10MB each • Maximum 10 images</p>
                      </div>
                      <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <UploadCloud className="h-4 w-4 mr-1" />
                          High Resolution
                        </span>
                        <span className="flex items-center">
                          <ImagePlus className="h-4 w-4 mr-1" />
                          Multiple Upload
                        </span>
                      </div>
                    </div>
                  </div>

                  <input
                    type="file"
                    id="main-image-upload"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleMainImageUpload}
                  />

                  {/* Uploaded Images Grid */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-800">
                          Uploaded Images ({uploadedImages.length}/10)
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('main-image-upload')?.click()}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add More
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {uploadedImages.map((image, index) => (
                          <div key={image.id} className="relative group">
                            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200">
                              <img 
                                src={image.preview} 
                                alt={`Tour image ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                              />
                              
                              {/* Primary Badge */}
                              {image.isPrimary && (
                                <div className="absolute top-2 left-2">
                                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-2 py-1">
                                    Primary
                                  </Badge>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                                {!image.isPrimary && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSetPrimaryImage(image.id)}
                                    className="bg-white/20 text-white hover:bg-white/30 h-8 px-3 text-xs backdrop-blur-sm"
                                  >
                                    Set Primary
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveImage(image.id)}
                                  className="bg-red-500/80 text-white hover:bg-red-600/90 h-8 w-8 p-0 rounded-full backdrop-blur-sm"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Image Info */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                <p className="text-white text-xs font-medium truncate">{image.name}</p>
                                <p className="text-white/80 text-xs">{formatFileSize(image.size)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}                </div>

                {/* Tour Summary Preview */}
                <div className="space-y-6">
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Tour Summary</h3>
                    <p className="text-sm text-gray-600 mb-6">Review all the details before publishing your tour</p>
                  </div>

                  {(() => {
                    const summary = generateTourSummary();
                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Basic Information Card */}
                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-lg shadow-blue-900/5 rounded-xl">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                <Calendar className="h-5 w-5 text-blue-600" />
                              </div>
                              Basic Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-semibold text-gray-700">Name:</span>
                                <p className="text-gray-600">{summary.basicInfo.name || 'Not set'}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">Category:</span>
                                <p className="text-gray-600">{summary.basicInfo.category || 'Not set'}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">Duration:</span>
                                <p className="text-gray-600">{summary.basicInfo.duration}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">Difficulty:</span>
                                <p className="text-gray-600">{summary.basicInfo.difficulty}</p>
                              </div>
                            </div>
                            {summary.basicInfo.highlights.length > 0 && (
                              <div>
                                <span className="font-semibold text-gray-700 block mb-1">Highlights:</span>
                                <div className="flex flex-wrap gap-1">
                                  {summary.basicInfo.highlights.slice(0, 3).map((highlight, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {highlight.length > 20 ? `${highlight.slice(0, 20)}...` : highlight}
                                    </Badge>
                                  ))}
                                  {summary.basicInfo.highlights.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{summary.basicInfo.highlights.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Pricing Card */}
                        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-lg shadow-green-900/5 rounded-xl">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                              <div className="p-2 bg-green-100 rounded-lg mr-3">
                                <DollarSign className="h-5 w-5 text-green-600" />
                              </div>
                              Pricing & Capacity
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 space-y-3">
                            <div className="grid grid-cols-1 gap-4 text-sm">
                              <div>
                                <span className="font-semibold text-gray-700">Price Per Person:</span>
                                <p className="text-gray-600">{summary.pricing.pricePerPerson}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">Available Spots:</span>
                                <p className="text-gray-600">{summary.pricing.availableSpots}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Content Stats Card */}
                        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 shadow-lg shadow-purple-900/5 rounded-xl">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                                <ImagePlus className="h-5 w-5 text-purple-600" />
                              </div>
                              Content & Media
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-semibold text-gray-700">Itinerary Days:</span>
                                <p className="text-gray-600">{summary.itinerary.totalDays}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">Accommodations:</span>
                                <p className="text-gray-600">{summary.accommodation.totalOptions}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">Images:</span>
                                <p className="text-gray-600">{summary.media.totalImages}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">Availability:</span>
                                <p className="text-gray-600">{summary.availability.totalPeriods} periods</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Readiness Check Card */}
                        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-lg shadow-amber-900/5 rounded-xl">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                                <XIcon className="h-5 w-5 text-amber-600" />
                              </div>
                              Readiness Check
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              {[
                                { check: summary.basicInfo.name, label: 'Tour name' },
                                { check: summary.pricing.pricePerPerson !== 'Not set', label: 'Price per person set' },
                                { check: summary.pricing.availableSpots !== 'Not set', label: 'Available spots set' },
                                { check: summary.itinerary.totalDays > 0, label: 'Itinerary created' },
                                { check: summary.media.hasPrimaryImage, label: 'Primary image set' },
                                { check: summary.availability.totalPeriods > 0, label: 'Availability set' }
                              ].map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-2 text-sm">
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                    item.check ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                  }`}>
                                    {item.check ? '✓' : '✗'}
                                  </div>
                                  <span className={item.check ? 'text-gray-600' : 'text-red-600'}>
                                    {item.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 bg-gradient-to-r from-gray-50/50 to-blue-50/30 rounded-2xl p-6 border border-gray-100">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50 disabled:opacity-50 rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Button>
              
              <div className="text-sm font-semibold text-gray-600 bg-white/60 px-4 py-2 rounded-xl border border-gray-200">
                Step {currentStep} of {steps.length}
              </div>

              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  Next: {steps[currentStep]?.name}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              ) : (
                <Button
                  onClick={handlePublish}
                  className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Publish Tour
                </Button>
              )}</div>
          </CardContent>
        </Card>
    </div>
  );
}
