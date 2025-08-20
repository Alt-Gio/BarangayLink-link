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
        attendees: { select: { id: true, name: true, role: true } },
        _count: {
          select: {
            attendees: true
          }
        }
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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
      include: { 
        createdBy: true,
        attendees: true
      },
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
        ...(data.description && { description: data.description }),
        ...(data.category && { category: data.category }),
        ...(data.type && { type: data.type }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.location && { location: data.location }),
        ...(data.maxAttendees !== undefined && { maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees) : null }),
        ...(data.actualAttendees !== undefined && { actualAttendees: parseInt(data.actualAttendees) }),
        ...(data.requirements && { requirements: data.requirements }),
        ...(data.contactInfo && { contactInfo: data.contactInfo }),
        ...(data.budget !== undefined && { budget: data.budget ? parseFloat(data.budget) : 0 }),
        ...(data.status && { status: data.status }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      },
      include: {
        createdBy: { select: { name: true } },
        attendees: { select: { id: true, name: true } },
        _count: {
          select: {
            attendees: true
          }
        }
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
