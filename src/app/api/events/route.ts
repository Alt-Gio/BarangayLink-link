import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    // For TEST MODE: Allow unauthenticated access with public events only
    if (!userId) {
      console.log('No auth - returning public events only');
      const publicEvents = await prisma.event.findMany({
        where: { isPublic: true },
        include: {
          createdBy: { select: { name: true, role: true } },
          _count: {
          select: {
            announcements: true,
            documents: true,
            activityLogs: true
          }
        }
        },
        orderBy: { startDate: 'asc' },
        take: 10
      });
      
      return NextResponse.json({ 
        events: publicEvents.map(formatEvent),
        total: publicEvents.length,
        accessLevel: 'public'
      });
    }

    // Get current user with role
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User accessing events:', { name: user.name, role: user.role });

    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get('public') === 'true';

    // Build access query based on role hierarchy
    let whereClause: any = {};
    
    if (isPublic) {
      whereClause = { isPublic: true };
    } else {
      switch (user.role) {
        case 'ADMIN':
        case 'BARANGAY_CAPTAIN':
          // Level 5-6: Access ALL events
          whereClause = {};
          break;
          
        case 'SECRETARY':
        case 'TREASURER':
          // Level 4: Department events + public events + created events
          whereClause = {
            OR: [
              { isPublic: true },
              { createdById: user.id },
              { category: { in: ['GOVERNMENT', 'GENERAL'] } }
            ]
          };
          break;
          
        case 'COUNCILOR':
          // Level 3: Committee events + created events + assigned events
          whereClause = {
            OR: [
              { isPublic: true },
              { createdById: user.id },
              { category: { in: ['HEALTH', 'EDUCATION', 'SPORTS', 'CULTURAL', 'SOCIAL'] } }
            ]
          };
          break;
          
        case 'STAFF':
          // Level 1: Only public events + assigned events
          whereClause = {
            OR: [
              { isPublic: true },
              { createdById: user.id }
            ]
          };
          break;
          
        default:
          whereClause = { isPublic: true };
      }
    }

    // Fetch events based on access level
    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        createdBy: { 
          select: { 
            id: true, 
            name: true, 
            role: true 
          } 
        },
        project: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            announcements: true,
            documents: true,
            activityLogs: true
          }
        }
      },
      orderBy: { startDate: 'asc' }
    });

    const formattedEvents = events.map(formatEvent);

    return NextResponse.json({ 
      events: formattedEvents,
      total: formattedEvents.length,
      userRole: user.role,
      accessLevel: getEventAccessLevel(user.role)
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch events',
        details: error instanceof Error ? error.message : 'Unknown error',
        events: []
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has permission to create events (Level 3+)
    if (user.role === 'STAFF') {
      return NextResponse.json({ error: 'Insufficient permissions to create events' }, { status: 403 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.startDate || !data.location) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, startDate, and location are required' 
      }, { status: 400 });
    }

    // Create event with Prisma
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description || '',
        shortDescription: data.shortDescription || data.description?.substring(0, 150),
        location: data.location,
        venue: data.venue,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : new Date(data.startDate),
        startTime: data.startTime,
        endTime: data.endTime,
        isAllDay: data.isAllDay || false,
        eventType: data.eventType || 'COMMUNITY',
        status: 'SCHEDULED',
        category: data.category || 'GENERAL',
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        featuredOnLanding: data.featuredOnLanding || false,
        agenda: data.agenda,
        requirements: data.requirements,
        contactInfo: data.contactInfo,
        targetAudience: data.targetAudience,
        featuredImage: data.featuredImage,
        expectedAttendees: data.expectedAttendees ? parseInt(data.expectedAttendees.toString()) : null,
        actualAttendees: 0,
        registrationRequired: data.registrationRequired || false,
        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : null,
        maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees.toString()) : null,
        budget: data.budget ? parseFloat(data.budget.toString()) : 0,
        tags: data.tags || [],
        projectId: data.projectId || null,
        createdById: user.id
      },
      include: {
        createdBy: { 
          select: { 
            id: true, 
            name: true, 
            role: true 
          } 
        },
        project: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            announcements: true,
            documents: true,
            activityLogs: true
          }
        }
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'CREATED',
        description: `Event "${event.title}" created`,
        entityType: 'Event',
        entityId: event.id,
        userId: user.id,
        eventId: event.id,
        projectId: event.projectId
      }
    });

    const formattedEvent = formatEvent(event);
    return NextResponse.json(formattedEvent, { status: 201 });

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create event',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions
function formatEvent(event: any) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    shortDescription: event.shortDescription,
    location: event.location,
    venue: event.venue,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate?.toISOString(),
    startTime: event.startTime,
    endTime: event.endTime,
    isAllDay: event.isAllDay,
    eventType: event.eventType,
    status: event.status,
    category: event.category,
    isPublic: event.isPublic,
    featuredOnLanding: event.featuredOnLanding,
    agenda: event.agenda,
    requirements: event.requirements,
    contactInfo: event.contactInfo,
    targetAudience: event.targetAudience,
    featuredImage: event.featuredImage,
    expectedAttendees: event.expectedAttendees,
    actualAttendees: event.actualAttendees,
    registrationRequired: event.registrationRequired,
    registrationDeadline: event.registrationDeadline?.toISOString(),
    maxAttendees: event.maxAttendees,
    budget: Number(event.budget || 0),
    tags: event.tags,
    projectId: event.projectId,
    projectName: event.project?.name,
    createdById: event.createdById,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
    createdBy: event.createdBy,
    project: event.project,
    _count: event._count
  };
}

function getEventAccessLevel(role: string): string {
  switch (role) {
    case 'ADMIN': return 'full';
    case 'BARANGAY_CAPTAIN': return 'executive';
    case 'SECRETARY':
    case 'TREASURER': return 'departmental';
    case 'COUNCILOR': return 'committee';
    case 'STAFF': return 'limited';
    default: return 'public';
  }
}

