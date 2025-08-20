import { prisma } from '@/lib/prisma';
import { Event, EventStatus, EventType, EventCategory } from '@prisma/client';

export interface PublicEvent {
  id: string;
  title: string;
  description: string | null;
  shortDescription: string | null;
  location: string | null;
  venue: string | null;
  startDate: Date;
  endDate: Date | null;
  isAllDay: boolean;
  eventType: EventType;
  status: EventStatus;
  category: EventCategory;
  featuredImage: string | null;
  galleryImages: string[];
  expectedAttendees: number | null;
  actualAttendees: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getPublicEvents(): Promise<PublicEvent[]> {
  try {
    const events = await prisma.event.findMany({
      where: {
        isPublic: true,
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED'],
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        shortDescription: true,
        location: true,
        venue: true,
        startDate: true,
        endDate: true,
        isAllDay: true,
        eventType: true,
        status: true,
        category: true,
        featuredImage: true,
        galleryImages: true,
        expectedAttendees: true,
        actualAttendees: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return events;
  } catch (error) {
    console.error('Error fetching public events:', error);
    return [];
  }
}

export async function getUpcomingEvents(): Promise<PublicEvent[]> {
  try {
    const now = new Date();
    const events = await prisma.event.findMany({
      where: {
        isPublic: true,
        status: 'SCHEDULED',
        startDate: {
          gte: now,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        shortDescription: true,
        location: true,
        venue: true,
        startDate: true,
        endDate: true,
        isAllDay: true,
        eventType: true,
        status: true,
        category: true,
        featuredImage: true,
        galleryImages: true,
        expectedAttendees: true,
        actualAttendees: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        startDate: 'asc',
      },
      take: 10,
    });

    return events;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}

export async function getEventsByMonth(year: number, month: number): Promise<PublicEvent[]> {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const events = await prisma.event.findMany({
      where: {
        isPublic: true,
        startDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        shortDescription: true,
        location: true,
        venue: true,
        startDate: true,
        endDate: true,
        isAllDay: true,
        eventType: true,
        status: true,
        category: true,
        featuredImage: true,
        galleryImages: true,
        expectedAttendees: true,
        actualAttendees: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    return events;
  } catch (error) {
    console.error('Error fetching events by month:', error);
    return [];
  }
}

export async function getEventsByCategory(category: EventCategory): Promise<PublicEvent[]> {
  try {
    const events = await prisma.event.findMany({
      where: {
        isPublic: true,
        category,
      },
      select: {
        id: true,
        title: true,
        description: true,
        shortDescription: true,
        location: true,
        venue: true,
        startDate: true,
        endDate: true,
        isAllDay: true,
        eventType: true,
        status: true,
        category: true,
        featuredImage: true,
        galleryImages: true,
        expectedAttendees: true,
        actualAttendees: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return events;
  } catch (error) {
    console.error('Error fetching events by category:', error);
    return [];
  }
}

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalAttendees: number;
}

export async function getEventStats(): Promise<EventStats> {
  try {
    const now = new Date();
    
    const [totalEvents, upcomingEvents, completedEvents, attendeesSum] = await Promise.all([
      prisma.event.count({
        where: {
          isPublic: true,
        },
      }),
      prisma.event.count({
        where: {
          isPublic: true,
          status: 'SCHEDULED',
          startDate: {
            gte: now,
          },
        },
      }),
      prisma.event.count({
        where: {
          isPublic: true,
          status: 'COMPLETED',
        },
      }),
      prisma.event.aggregate({
        where: {
          isPublic: true,
          status: 'COMPLETED',
          actualAttendees: {
            not: null,
          },
        },
        _sum: {
          actualAttendees: true,
        },
      }),
    ]);

    return {
      totalEvents,
      upcomingEvents,
      completedEvents,
      totalAttendees: attendeesSum._sum.actualAttendees || 0,
    };
  } catch (error) {
    console.error('Error fetching event stats:', error);
    return {
      totalEvents: 0,
      upcomingEvents: 0,
      completedEvents: 0,
      totalAttendees: 0,
    };
  }
}
