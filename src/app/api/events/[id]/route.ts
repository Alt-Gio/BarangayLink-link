import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        createdBy: { select: { name: true, role: true } },
        project: { select: { id: true, name: true } },
        _count: {
          select: {
            announcements: true,
            documents: true,
            activityLogs: true
          }
        }
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check access permissions
    const hasAccess = 
      event.isPublic ||
      event.createdById === user.id ||
      user.role === 'ADMIN' ||
      user.role === 'BARANGAY_CAPTAIN' ||
      (user.role === 'SECRETARY' && event.category === 'GOVERNMENT') ||
      (user.role === 'COUNCILOR' && ['HEALTH', 'EDUCATION', 'CULTURAL'].includes(event.category));

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json(formatEvent(event));
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await request.json();

    // Get existing event to check permissions
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id },
      include: { createdBy: true },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check permissions
    const canEdit = 
      user.role === 'ADMIN' ||
      user.role === 'BARANGAY_CAPTAIN' ||
      existingEvent.createdById === user.id;

    if (!canEdit) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Update event
    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.location && { location: data.location }),
        ...(data.venue !== undefined && { venue: data.venue }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.startTime !== undefined && { startTime: data.startTime }),
        ...(data.endTime !== undefined && { endTime: data.endTime }),
        ...(data.eventType && { eventType: data.eventType }),
        ...(data.category && { category: data.category }),
        ...(data.status && { status: data.status }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
        ...(data.maxAttendees !== undefined && { maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees.toString()) : null }),
        ...(data.actualAttendees !== undefined && { actualAttendees: parseInt(data.actualAttendees.toString()) }),
        ...(data.budget !== undefined && { budget: data.budget ? parseFloat(data.budget.toString()) : 0 }),
        ...(data.requirements !== undefined && { requirements: data.requirements }),
        ...(data.contactInfo !== undefined && { contactInfo: data.contactInfo }),
      },
      include: {
        createdBy: { select: { name: true, role: true } },
        project: { select: { id: true, name: true } },
        _count: {
          select: {
            announcements: true,
            documents: true,
            activityLogs: true
          }
        }
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'UPDATED',
        description: `Event "${updatedEvent.title}" updated`,
        entityType: 'Event',
        entityId: updatedEvent.id,
        userId: user.id,
        eventId: updatedEvent.id
      }
    });

    return NextResponse.json(formatEvent(updatedEvent));
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only admin or barangay captain can delete events
    if (user.role !== 'ADMIN' && user.role !== 'BARANGAY_CAPTAIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const event = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    await prisma.event.delete({
      where: { id: params.id },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'DELETED',
        description: `Event "${event.title}" deleted`,
        entityType: 'Event',
        entityId: event.id,
        userId: user.id
      }
    });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function (reuse from main events route)
function formatEvent(event: any) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    venue: event.venue,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate?.toISOString(),
    startTime: event.startTime,
    endTime: event.endTime,
    eventType: event.eventType,
    status: event.status,
    category: event.category,
    isPublic: event.isPublic,
    maxAttendees: event.maxAttendees,
    actualAttendees: event.actualAttendees,
    budget: Number(event.budget || 0),
    requirements: event.requirements,
    contactInfo: event.contactInfo,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
    createdBy: event.createdBy,
    project: event.project,
    _count: event._count
  };
}
