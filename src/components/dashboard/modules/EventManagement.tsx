"use client";

import { useState, useEffect } from 'react';
import { useAuth, MODULE_PERMISSIONS } from '@/context/AuthContext';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Share2,
  Download,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  Globe,
  Lock,
  Megaphone,
  Image,
  FileText,
  Target,
  TrendingUp,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string;
  startDate: string;
  endDate: string;
  type: 'COMMUNITY' | 'MEETING' | 'PROGRAM' | 'EMERGENCY' | 'CELEBRATION' | 'TRAINING' | 'CEREMONY' | 'SPORTS' | 'CULTURAL' | 'HEALTH' | 'EDUCATION' | 'CONSULTATION';
  status: 'PLANNED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';
  category: 'GENERAL' | 'GOVERNMENT' | 'HEALTH' | 'EDUCATION' | 'SPORTS' | 'CULTURAL' | 'EMERGENCY' | 'ENVIRONMENT' | 'INFRASTRUCTURE' | 'SOCIAL';
  isPublic: boolean;
  requirements: string | null;
  contactInfo: string | null;
  maxAttendees: number | null;
  actualAttendees: number;
  budget: number;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    name: string;
  };
  attendees: Array<{
    id: string;
    name: string;
  }>;
  _count: {
    attendees: number;
  };
}

interface EventStats {
  total: number;
  upcoming: number;
  inProgress: number;
  completed: number;
  publicEvents: number;
  totalAttendees: number;
}



const statusColors = {
  PLANNED: 'bg-blue-900/20 text-blue-300 border-blue-700',
  APPROVED: 'bg-green-900/20 text-green-300 border-green-700',
  IN_PROGRESS: 'bg-purple-900/20 text-purple-300 border-purple-700',
  COMPLETED: 'bg-emerald-900/20 text-emerald-300 border-emerald-700',
  CANCELLED: 'bg-red-900/20 text-red-300 border-red-700',
  POSTPONED: 'bg-yellow-900/20 text-yellow-300 border-yellow-700',
};

const typeColors = {
  COMMUNITY: 'bg-green-900/20 text-green-300',
  MEETING: 'bg-purple-900/20 text-purple-300',
  PROGRAM: 'bg-blue-900/20 text-blue-300',
  EMERGENCY: 'bg-red-900/20 text-red-300',
  CELEBRATION: 'bg-pink-900/20 text-pink-300',
  TRAINING: 'bg-orange-900/20 text-orange-300',
  CEREMONY: 'bg-indigo-900/20 text-indigo-300',
  SPORTS: 'bg-cyan-900/20 text-cyan-300',
  CULTURAL: 'bg-purple-900/20 text-purple-300',
  HEALTH: 'bg-rose-900/20 text-rose-300',
  EDUCATION: 'bg-amber-900/20 text-amber-300',
  CONSULTATION: 'bg-teal-900/20 text-teal-300',
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED': return CheckCircle;
    case 'IN_PROGRESS': return Clock;
    case 'CANCELLED': case 'POSTPONED': return AlertCircle;
    default: return Calendar;
  }
};

export function EventManagement() {
  const { hasPermission } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');

  const canCreate = hasPermission(MODULE_PERMISSIONS.EVENT_MANAGEMENT.CREATE);
  const canPublish = hasPermission(MODULE_PERMISSIONS.EVENT_MANAGEMENT.PUBLISH);
  const canEdit = hasPermission(MODULE_PERMISSIONS.EVENT_MANAGEMENT.CREATE);
  const canManageRegistration = hasPermission(MODULE_PERMISSIONS.EVENT_MANAGEMENT.MANAGE_REGISTRATION);

  // Fetch events from database
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events || []);
      
      // Calculate stats from fetched data
      const now = new Date();
      const eventStats: EventStats = {
        total: data.events?.length || 0,
        upcoming: data.events?.filter((e: Event) => new Date(e.startDate) > now && e.status !== 'CANCELLED').length || 0,
        inProgress: data.events?.filter((e: Event) => e.status === 'IN_PROGRESS').length || 0,
        completed: data.events?.filter((e: Event) => e.status === 'COMPLETED').length || 0,
        publicEvents: data.events?.filter((e: Event) => e.isPublic).length || 0,
        totalAttendees: data.events?.reduce((sum: number, e: Event) => sum + e.actualAttendees, 0) || 0,
      };
      
      setStats(eventStats);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Delete event
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Refresh events list
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event. Please try again.');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || event.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || event.type === typeFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'ALL') {
      const eventDate = new Date(event.startDate);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (dateFilter) {
        case 'TODAY':
          matchesDate = eventDate.toDateString() === today.toDateString();
          break;
        case 'THIS_WEEK':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesDate = eventDate >= weekStart && eventDate <= weekEnd;
          break;
        case 'THIS_MONTH':
          matchesDate = eventDate.getMonth() === today.getMonth() && 
                       eventDate.getFullYear() === today.getFullYear();
          break;
        case 'UPCOMING':
          matchesDate = eventDate >= today;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const formatEventDate = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      if (start.toDateString() === end.toDateString()) {
        return start.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
      } else {
        return `${start.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })} - ${end.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })}`;
      }
    }
    return start.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatEventTime = (startTime: string, endTime?: string, isAllDay: boolean = false) => {
    if (isAllDay) return 'All Day';
    
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    if (endTime) {
      return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    }
    return formatTime(startTime);
  };

  const EventCard = ({ event }: { event: Event }) => {
    const StatusIcon = getStatusIcon(event.status);
    const isUpcoming = new Date(event.startDate) > new Date();
    const isPast = new Date(event.startDate) < new Date() && event.status !== 'IN_PROGRESS';

    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100 text-lg leading-tight">{event.title}</h3>
              <p className="text-sm text-gray-400">{event.createdBy.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {event.isPublic && (
              <Globe className="w-4 h-4 text-blue-400" title="Public Event" />
            )}
            {!event.isPublic && (
              <Lock className="w-4 h-4 text-gray-400" title="Private Event" />
            )}
            <div className="relative">
              <button className="p-1 hover:bg-gray-700 rounded">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Status and Type */}
        <div className="flex items-center gap-2 mb-4">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium border",
            statusColors[event.status]
          )}>
            {event.status.replace('_', ' ')}
          </span>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            typeColors[event.type]
          )}>
            {event.type}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CalendarDays className="w-4 h-4" />
            <span>{formatEventDate(event.startDate, event.endDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{new Date(event.startDate).toLocaleTimeString()} - {new Date(event.endDate).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          {event.maxAttendees && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>Max: {event.maxAttendees} attendees</span>
            </div>
          )}
          {event.actualAttendees > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>Registered: {event.actualAttendees} attendees</span>
            </div>
          )}
        </div>

        {/* Budget Info */}
        {event.budget > 0 && (
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-green-300 text-sm">
              <Target className="w-4 h-4" />
              <span>Budget: ₱{event.budget.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-1">
            <StatusIcon className={cn(
              "w-4 h-4",
              event.status === 'COMPLETED' ? "text-green-400" :
              event.status === 'CANCELLED' ? "text-red-400" :
              event.status === 'IN_PROGRESS' ? "text-blue-400" : "text-gray-400"
            )} />
            <span className="text-xs text-gray-400">
              {isPast ? 'Past Event' : isUpcoming ? 'Upcoming' : 'Ongoing'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Link 
              href={`/dashboard/events/${event.id}`}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>
            {canEdit && (
              <Link 
                href={`/dashboard/events/${event.id}/edit`}
                className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded"
                title="Edit Event"
              >
                <Edit className="w-4 h-4" />
              </Link>
            )}
            {canManageRegistration && event.registrationRequired && (
              <Link 
                href={`/dashboard/events/${event.id}/registration`}
                className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-900/20 rounded"
                title="Manage Registration"
              >
                <Users className="w-4 h-4" />
              </Link>
            )}
            <button 
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded"
              title="Share Event"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleDeleteEvent(event.id)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded"
              title="Delete Event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Event Management</h1>
          <p className="text-gray-400">Plan, organize, and manage community events</p>
        </div>
        <div className="flex items-center gap-2">
          {canCreate && (
            <Link 
              href="/dashboard/events/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Event
            </Link>
          )}
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Failed to Load Events</h3>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchEvents}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">{stats?.total || 0}</p>
              )}
              <p className="text-sm text-gray-400">Total Events</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">{stats?.upcoming || 0}</p>
              )}
              <p className="text-sm text-gray-400">Upcoming</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">{stats?.totalAttendees || 0}</p>
              )}
              <p className="text-sm text-gray-400">Total Attendees</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">{stats?.publicEvents || 0}</p>
              )}
              <p className="text-sm text-gray-400">Public Events</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="ALL">All Status</option>
            <option value="PLANNED">Planned</option>
            <option value="APPROVED">Approved</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="POSTPONED">Postponed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="ALL">All Types</option>
            <option value="COMMUNITY">Community</option>
            <option value="MEETING">Meeting</option>
            <option value="TRAINING">Training</option>
            <option value="CELEBRATION">Celebration</option>
            <option value="HEALTH">Health</option>
            <option value="EDUCATION">Education</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="ALL">All Dates</option>
            <option value="TODAY">Today</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="UPCOMING">Upcoming</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-6 animate-pulse">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {!loading && filteredEvents.length === 0 && !error && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-100 mb-2">No events found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL' || dateFilter !== 'ALL'
              ? 'Try adjusting your search or filters.'
              : 'Get started by creating your first event.'
            }
          </p>
          {canCreate && (
            <Link 
              href="/dashboard/events/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </Link>
          )}
        </div>
      )}
    </div>
  );
}