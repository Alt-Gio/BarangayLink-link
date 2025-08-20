import { useState, useEffect } from 'react';

interface PublicStats {
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  totalEvents: number;
  upcomingEvents: number;
  totalAnnouncements: number;
  publicDocuments: number;
  projectCompletionRate: number;
}

interface PublicProject {
  id: string;
  name: string;
  description: string;
  status: string;
  category: string;
  progressPercentage: number;
  budget?: number;
  location?: string;
  isPublic: boolean;
  startDate?: string;
  dueDate?: string;
  manager: {
    name: string;
    position: string;
  };
  _count: {
    tasks: number;
  };
}

interface PublicEvent {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  location: string;
  venue?: string;
  startDate: string;
  endDate?: string;
  eventType: string;
  category: string;
  isPublic: boolean;
  featuredOnLanding: boolean;
  project?: {
    name: string;
  };
}

interface PublicAnnouncement {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  type: string;
  priority: string;
  isPinned: boolean;
  showOnLanding: boolean;
  createdAt: string;
  createdBy: {
    name: string;
    position: string;
  };
}

export function usePublicStats() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/public/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function usePublicProjects(limit: number = 6, featured: boolean = false) {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          ...(featured && { featured: 'true' }),
        });
        
        const response = await fetch(`/api/public/projects?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [limit, featured]);

  return { projects, loading, error };
}

export function usePublicEvents(limit: number = 10, featured: boolean = false) {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          ...(featured && { featured: 'true' }),
        });
        
        const response = await fetch(`/api/public/events?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [limit, featured]);

  return { events, loading, error };
}

export function usePublicAnnouncements(limit: number = 5, latest: boolean = false) {
  const [announcements, setAnnouncements] = useState<PublicAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          ...(latest && { latest: 'true' }),
        });
        
        const response = await fetch(`/api/public/announcements?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }
        const data = await response.json();
        setAnnouncements(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [limit, latest]);

  return { announcements, loading, error };
}
