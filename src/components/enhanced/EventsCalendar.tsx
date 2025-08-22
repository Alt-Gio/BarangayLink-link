"use client";

import { useEffect, useRef, useState } from 'react';
import { Calendar, List, Users, MapPin, Clock, Plus, CheckCircle, XCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: 'event' | 'project' | 'meeting';
  participants: number;
  maxParticipants: number;
  isJoined: boolean;
  status: 'upcoming' | 'ongoing' | 'completed';
  category: string;
}

export function EventsCalendar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<string>('all');

  // Sample events data
  const sampleEvents: Event[] = [
    {
      id: '1',
      title: 'Community Clean-up Drive',
      description: 'Join us for a community-wide clean-up initiative to maintain our barangay\'s cleanliness.',
      date: new Date(2024, 2, 15),
      time: '8:00 AM - 12:00 PM',
      location: 'Barangay Plaza',
      type: 'event',
      participants: 45,
      maxParticipants: 100,
      isJoined: false,
      status: 'upcoming',
      category: 'environment'
    },
    {
      id: '2',
      title: 'Road Improvement Project',
      description: 'Infrastructure development project for better road connectivity.',
      date: new Date(2024, 2, 20),
      time: '7:00 AM - 5:00 PM',
      location: 'Main Street',
      type: 'project',
      participants: 12,
      maxParticipants: 20,
      isJoined: true,
      status: 'upcoming',
      category: 'infrastructure'
    },
    {
      id: '3',
      title: 'Barangay Council Meeting',
      description: 'Monthly council meeting to discuss community issues and development plans.',
      date: new Date(2024, 2, 25),
      time: '2:00 PM - 4:00 PM',
      location: 'Barangay Hall',
      type: 'meeting',
      participants: 8,
      maxParticipants: 15,
      isJoined: false,
      status: 'upcoming',
      category: 'governance'
    },
    {
      id: '4',
      title: 'Health Awareness Seminar',
      description: 'Educational seminar on health and wellness for all residents.',
      date: new Date(2024, 2, 28),
      time: '9:00 AM - 11:00 AM',
      location: 'Health Center',
      type: 'event',
      participants: 30,
      maxParticipants: 50,
      isJoined: false,
      status: 'upcoming',
      category: 'health'
    },
    {
      id: '5',
      title: 'Youth Development Program',
      description: 'Skills training and development program for young residents.',
      date: new Date(2024, 3, 5),
      time: '1:00 PM - 5:00 PM',
      location: 'Community Center',
      type: 'event',
      participants: 25,
      maxParticipants: 40,
      isJoined: false,
      status: 'upcoming',
      category: 'education'
    }
  ];

  useEffect(() => {
    setEvents(sampleEvents);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate calendar section entrance
      gsap.fromTo('.calendar-section', 
        { 
          opacity: 0,
          y: 50
        },
        { 
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        }
      );

      // Animate event cards
      gsap.fromTo('.event-card', 
        { 
          opacity: 0,
          scale: 0.9,
          y: 30
        },
        { 
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const handleJoinEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isJoined: !event.isJoined, participants: event.isJoined ? event.participants - 1 : event.participants + 1 }
        : event
    ));
  };

  const filteredEvents = events.filter(event => 
    filter === 'all' || event.category === filter
  );

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 text-gray-400"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          className={`p-2 cursor-pointer transition-all duration-300 ${
            isToday ? 'bg-green-100 dark:bg-green-900/30' : ''
          } ${
            isSelected ? 'ring-2 ring-green-500' : ''
          } hover:bg-gray-50 dark:hover:bg-gray-700/50`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {day}
          </div>
          {dayEvents.length > 0 && (
            <div className="mt-1">
              {dayEvents.slice(0, 2).map((event, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full mb-1 ${
                    event.type === 'event' ? 'bg-blue-500' :
                    event.type === 'project' ? 'bg-green-500' : 'bg-purple-500'
                  }`}
                ></div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-gray-500">+{dayEvents.length - 2}</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const renderEventList = () => {
    return (
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="event-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100 dark:border-green-900/30 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.type === 'event' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    event.type === 'project' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  }`}>
                    {event.type.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.status === 'upcoming' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    event.status === 'ongoing' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {event.status.toUpperCase()}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {event.description}
                </p>
                
                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {event.date.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {event.participants}/{event.maxParticipants}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <button
                  onClick={() => handleJoinEvent(event.id)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    event.isJoined
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {event.isJoined ? (
                    <>
                      <XCircle className="w-4 h-4" />
                      Leave
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Join
                    </>
                  )}
                </button>
                
                {event.isJoined && (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Joined
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Events & Projects Calendar
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Stay updated with community events, projects, and meetings. Join activities that interest you!
          </p>
        </div>

        <div ref={containerRef} className="calendar-section">
          {/* View Toggle and Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  viewMode === 'calendar'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="environment">Environment</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="governance">Governance</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
            </select>
          </div>

          {viewMode === 'calendar' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-100 dark:border-green-900/30">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      ←
                    </button>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      →
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {renderCalendar()}
                  </div>
                </div>
              </div>

              {/* Selected Date Events */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-100 dark:border-green-900/30">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Events for {selectedDate.toLocaleDateString()}
                  </h3>
                  
                  <div className="space-y-3">
                    {getEventsForDate(selectedDate).length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No events scheduled for this date.
                      </p>
                    ) : (
                      getEventsForDate(selectedDate).map((event) => (
                        <div key={event.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {event.title}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              event.type === 'event' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                              event.type === 'project' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            }`}>
                              {event.type}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {event.time} • {event.location}
                          </p>
                          <button
                            onClick={() => handleJoinEvent(event.id)}
                            className={`w-full px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-300 ${
                              event.isJoined
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                          >
                            {event.isJoined ? 'Leave Event' : 'Join Event'}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            renderEventList()
          )}
        </div>
      </div>
    </section>
  );
}
