"use client";

import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const allEvents = [
  // August 2024 Events
  {
    id: 1,
    title: "Community Clean-Up Drive",
    date: "2024-08-20",
    time: "7:00 AM",
    location: "Barangay Plaza",
    attendees: 45,
    type: "community",
    description: "Join us for our monthly community clean-up initiative",
    status: "upcoming"
  },
  {
    id: 2,
    title: "Health and Wellness Seminar",
    date: "2024-08-22",
    time: "2:00 PM",
    location: "Community Center",
    attendees: 32,
    type: "health",
    description: "Learn about preventive healthcare and wellness tips",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Barangay Assembly Meeting",
    date: "2024-08-25",
    time: "6:00 PM",
    location: "Barangay Hall",
    attendees: 78,
    type: "government",
    description: "Monthly assembly for community updates and concerns",
    status: "upcoming"
  },
  {
    id: 4,
    title: "Youth Development Workshop",
    date: "2024-08-28",
    time: "10:00 AM",
    location: "Youth Center",
    attendees: 28,
    type: "education",
    description: "Skills development and career guidance for youth",
    status: "upcoming"
  },
  {
    id: 5,
    title: "Senior Citizens Day",
    date: "2024-08-30",
    time: "9:00 AM",
    location: "Community Center",
    attendees: 56,
    type: "community",
    description: "Special celebration for our senior community members",
    status: "upcoming"
  },
  // July 2024 Events (Past)
  {
    id: 6,
    title: "Independence Day Celebration",
    date: "2024-07-12",
    time: "8:00 AM",
    location: "Barangay Plaza",
    attendees: 120,
    type: "celebration",
    description: "Celebrating Philippine Independence Day with cultural performances",
    status: "completed"
  },
  {
    id: 7,
    title: "Disaster Preparedness Training",
    date: "2024-07-15",
    time: "1:00 PM",
    location: "Emergency Center",
    attendees: 65,
    type: "safety",
    description: "Emergency response training for community members",
    status: "completed"
  },
  {
    id: 8,
    title: "Basketball Tournament Finals",
    date: "2024-07-20",
    time: "4:00 PM",
    location: "Sports Complex",
    attendees: 89,
    type: "sports",
    description: "Inter-barangay basketball championship finals",
    status: "completed"
  },
  // September 2024 Events (Future)
  {
    id: 9,
    title: "Teacher's Day Appreciation",
    date: "2024-09-05",
    time: "3:00 PM",
    location: "School Auditorium",
    attendees: 0,
    type: "education",
    description: "Honoring our dedicated educators",
    status: "upcoming"
  },
  {
    id: 10,
    title: "National Literacy Month Kickoff",
    date: "2024-09-08",
    time: "9:00 AM",
    location: "Library",
    attendees: 0,
    type: "education",
    description: "Promoting reading and literacy in the community",
    status: "upcoming"
  },
  {
    id: 11,
    title: "Environmental Awareness Week",
    date: "2024-09-15",
    time: "8:00 AM",
    location: "Community Garden",
    attendees: 0,
    type: "environment",
    description: "Tree planting and environmental conservation activities",
    status: "upcoming"
  }
];

const typeColors = {
  community: "bg-green-100 text-green-800",
  health: "bg-blue-100 text-blue-800",
  government: "bg-purple-100 text-purple-800",
  education: "bg-orange-100 text-orange-800",
  celebration: "bg-pink-100 text-pink-800",
  safety: "bg-red-100 text-red-800",
  sports: "bg-indigo-100 text-indigo-800",
  environment: "bg-emerald-100 text-emerald-800"
};

const eventCategories = [
  { value: 'all', label: 'All Events' },
  { value: 'community', label: 'Community' },
  { value: 'health', label: 'Health' },
  { value: 'government', label: 'Government' },
  { value: 'education', label: 'Education' },
  { value: 'celebration', label: 'Celebrations' },
  { value: 'safety', label: 'Safety' },
  { value: 'sports', label: 'Sports' },
  { value: 'environment', label: 'Environment' }
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 7)); // August 2024
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Filter events based on selected month/year and category
  const filteredEvents = allEvents.filter(event => {
    const eventDate = new Date(event.date);
    const matchesMonth = eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    const matchesCategory = selectedCategory === 'all' || event.type === selectedCategory;
    return matchesMonth && matchesCategory;
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  };

  const getCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const eventsOnDay = filteredEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === date.toDateString();
      });
      
      days.push({
        date,
        isCurrentMonth: date.getMonth() === currentMonth,
        events: eventsOnDay
      });
    }
    return days;
  };

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-gray-900">Community Events</h3>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "px-3 py-1 rounded text-sm font-medium transition-colors",
                viewMode === 'list' 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600"
              )}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={cn(
                "px-3 py-1 rounded text-sm font-medium transition-colors",
                viewMode === 'calendar' 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600"
              )}
            >
              Calendar
            </button>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-lg font-semibold text-gray-900 min-w-[140px] text-center">
            {months[currentMonth]} {currentYear}
          </div>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Settings className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <div className="flex gap-2">
          {eventCategories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                selectedCategory === category.value
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event Count Info */}
      <div className="mb-6 text-sm text-gray-600">
        Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} 
        {selectedCategory !== 'all' && ` in ${eventCategories.find(c => c.value === selectedCategory)?.label}`}
        {' '}for {months[currentMonth]} {currentYear}
      </div>

      {/* Content based on view mode */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No events found for the selected criteria.</p>
              <p className="text-sm mt-2">Try changing the month or category filter.</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group border border-gray-200 rounded-xl p-4 lg:p-6 hover:shadow-lg hover:border-green-300 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Date Card */}
                  <div className="flex-shrink-0 bg-green-50 rounded-lg p-3 text-center min-w-[70px]">
                    <div className="text-sm font-semibold text-green-600">
                      {getDayOfWeek(event.date)}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium capitalize",
                          typeColors[event.type as keyof typeof typeColors]
                        )}>
                          {event.type}
                        </span>
                        {event.status === 'completed' && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.status === 'completed' ? 
                            `${event.attendees} attended` : 
                            event.attendees > 0 ? `${event.attendees} attending` : 'Registration open'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {event.status === 'upcoming' && (
                    <button className="flex-shrink-0 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-green-100 hover:text-green-600 transition-colors">
                      Join
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {getCalendarDays().map((day, index) => (
              <div
                key={index}
                className={cn(
                  "min-h-[60px] p-2 border border-gray-200 rounded-lg transition-colors",
                  day.isCurrentMonth 
                    ? "bg-white" 
                    : "bg-gray-100 text-gray-400",
                  day.events.length > 0 && day.isCurrentMonth && "ring-2 ring-green-200"
                )}
              >
                <div className="font-medium text-sm mb-1">
                  {day.date.getDate()}
                </div>
                <div className="space-y-1">
                  {day.events.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "text-xs px-1 py-0.5 rounded truncate",
                        typeColors[event.type as keyof typeof typeColors]
                      )}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {day.events.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{day.events.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
