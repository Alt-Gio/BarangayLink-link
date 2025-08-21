"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, MODULE_PERMISSIONS } from '@/context/AuthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  FileText, 
  Image, 
  Globe, 
  Lock, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  status: string;
}

interface FormData {
  title: string;
  description: string;
  shortDescription: string;
  location: string;
  venue: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  eventType: string;
  category: string;
  isPublic: boolean;
  featuredOnLanding: boolean;
  agenda: string;
  requirements: string;
  contactInfo: string;
  targetAudience: string;
  expectedAttendees: number;
  registrationRequired: boolean;
  registrationDeadline: string;
  maxAttendees: number;
  budget: number;
  projectId: string;
  tags: string[];
}

const eventTypes = [
  { value: 'COMMUNITY', label: 'Community' },
  { value: 'MEETING', label: 'Meeting' },
  { value: 'PROGRAM', label: 'Program' },
  { value: 'EMERGENCY', label: 'Emergency' },
  { value: 'CELEBRATION', label: 'Celebration' },
  { value: 'TRAINING', label: 'Training' },
  { value: 'CEREMONY', label: 'Ceremony' },
  { value: 'SPORTS', label: 'Sports' },
  { value: 'CULTURAL', label: 'Cultural' },
  { value: 'HEALTH', label: 'Health' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'CONSULTATION', label: 'Consultation' }
];

const eventCategories = [
  { value: 'GENERAL', label: 'General' },
  { value: 'GOVERNMENT', label: 'Government' },
  { value: 'HEALTH', label: 'Health' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'SPORTS', label: 'Sports' },
  { value: 'CULTURAL', label: 'Cultural' },
  { value: 'EMERGENCY', label: 'Emergency' },
  { value: 'ENVIRONMENT', label: 'Environment' },
  { value: 'INFRASTRUCTURE', label: 'Infrastructure' },
  { value: 'SOCIAL', label: 'Social' }
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function CreateEventForm() {
  const router = useRouter();
  const { hasPermission } = useAuth();
  const [currentStep, setCurrentStep] = useState<'calendar' | 'details'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    shortDescription: '',
    location: '',
    venue: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '10:00',
    isAllDay: false,
    eventType: 'COMMUNITY',
    category: 'GENERAL',
    isPublic: true,
    featuredOnLanding: false,
    agenda: '',
    requirements: '',
    contactInfo: '',
    targetAudience: '',
    expectedAttendees: 0,
    registrationRequired: false,
    registrationDeadline: '',
    maxAttendees: 0,
    budget: 0,
    projectId: '',
    tags: []
  });

  const canCreate = hasPermission(MODULE_PERMISSIONS.EVENT_MANAGEMENT.CREATE);

  useEffect(() => {
    if (!canCreate) {
      router.push('/dashboard/events');
      return;
    }
    fetchProjects();
  }, [canCreate, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === new Date().toDateString(),
        isSelected: selectedDate && date.toDateString() === selectedDate.toDateString()
      });
    }
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateString = date.toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      startDate: dateString,
      endDate: dateString
    }));
  };

  const handleNextStep = () => {
    if (!selectedDate) {
      setError('Please select a date first');
      return;
    }
    setCurrentStep('details');
    setError(null);
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          startDate: `${formData.startDate}T${formData.startTime}:00`,
          endDate: formData.endDate ? `${formData.endDate}T${formData.endTime}:00` : undefined,
          tags: formData.tags.length > 0 ? formData.tags : undefined,
          projectId: formData.projectId || undefined,
          budget: formData.budget || undefined,
          maxAttendees: formData.maxAttendees || undefined,
          expectedAttendees: formData.expectedAttendees || undefined,
          registrationDeadline: formData.registrationDeadline || undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create event');
      }

      const event = await response.json();
      router.push(`/dashboard/events/${event.id}`);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!canCreate) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/events')}
            className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Create New Event</h1>
            <p className="text-gray-400">Plan and schedule a new community event</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-6">
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg",
          currentStep === 'calendar' 
            ? "bg-blue-900/20 text-blue-300 border border-blue-700" 
            : "bg-gray-800 text-gray-400 border border-gray-700"
        )}>
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">1. Select Date</span>
        </div>
        <div className="w-8 h-px bg-gray-700" />
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg",
          currentStep === 'details' 
            ? "bg-blue-900/20 text-blue-300 border border-blue-700" 
            : "bg-gray-800 text-gray-400 border border-gray-700"
        )}>
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">2. Event Details</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {currentStep === 'calendar' ? (
        /* Calendar Step */
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-2">Select Event Date</h2>
            <p className="text-gray-400">Choose the date for your event from the calendar below</p>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-100">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-gray-900 rounded-lg p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getCalendarDays().map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day.date)}
                  disabled={!day.isCurrentMonth}
                  className={cn(
                    "min-h-[60px] p-2 rounded-lg text-left transition-all duration-200",
                    day.isCurrentMonth 
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-100" 
                      : "bg-gray-900 text-gray-600 cursor-not-allowed",
                    day.isToday && "ring-2 ring-blue-500",
                    day.isSelected && "bg-blue-600 text-white hover:bg-blue-700",
                    day.isSelected && day.isToday && "ring-2 ring-blue-300"
                  )}
                >
                  <div className="font-medium text-sm">
                    {day.date.getDate()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Date Info */}
          {selectedDate && (
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-blue-300 font-medium">Selected Date</p>
                  <p className="text-gray-300">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={() => router.push('/dashboard/events')}
              className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleNextStep}
              disabled={!selectedDate}
              className={cn(
                "px-6 py-2 rounded-lg font-medium transition-colors",
                selectedDate
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              )}
            >
              Next: Event Details
            </button>
          </div>
        </div>
      ) : (
        /* Details Step */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-2">Event Details</h2>
              <p className="text-gray-400">Fill in the details for your event</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-100 border-b border-gray-700 pb-2">
                  Basic Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    placeholder="Brief description for preview"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    placeholder="Detailed event description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Event Type *
                    </label>
                    <select
                      required
                      value={formData.eventType}
                      onChange={(e) => handleInputChange('eventType', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    >
                      {eventTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    >
                      {eventCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Location & Time */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-100 border-b border-gray-700 pb-2">
                  Location & Time
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    placeholder="Event location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    placeholder="Specific venue or building"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isAllDay"
                    checked={formData.isAllDay}
                    onChange={(e) => handleInputChange('isAllDay', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isAllDay" className="text-sm text-gray-300">
                    All day event
                  </label>
                </div>

                {!formData.isAllDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-100 border-b border-gray-700 pb-2 mb-4">
              Additional Details
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agenda
                  </label>
                  <textarea
                    rows={3}
                    value={formData.agenda}
                    onChange={(e) => handleInputChange('agenda', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    placeholder="Event agenda or schedule"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    placeholder="What participants need to bring or prepare"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Information
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo}
                    onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    placeholder="Phone, email, or contact person"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    placeholder="Who should attend this event"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Expected Attendees
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.expectedAttendees}
                    onChange={(e) => handleInputChange('expectedAttendees', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    placeholder="Expected number of attendees"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Budget (₱)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    placeholder="Event budget"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Related Project
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => handleInputChange('projectId', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                  >
                    <option value="">No project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-300 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Public Event
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featuredOnLanding"
                      checked={formData.featuredOnLanding}
                      onChange={(e) => handleInputChange('featuredOnLanding', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="featuredOnLanding" className="text-sm text-gray-300">
                      Feature on landing page
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="registrationRequired"
                      checked={formData.registrationRequired}
                      onChange={(e) => handleInputChange('registrationRequired', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="registrationRequired" className="text-sm text-gray-300">
                      Registration required
                    </label>
                  </div>
                </div>

                {formData.registrationRequired && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Attendees
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxAttendees}
                        onChange={(e) => handleInputChange('maxAttendees', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                        placeholder="Maximum number of attendees"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Registration Deadline
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.registrationDeadline}
                        onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep('calendar')}
              className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              Back to Calendar
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/dashboard/events')}
                className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Event
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
