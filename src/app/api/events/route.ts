import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get('public') === 'true';

    if (isPublic) {
      // Fetch public events only
      const events = await prisma.event.findMany({
        where: { isPublic: true },
        include: {
          createdBy: { select: { name: true } },
          _count: {
            select: {
              attendees: true
            }
          }
        },
        orderBy: { startDate: 'asc' }
      });
      return NextResponse.json({ events });
    }

    // Fetch all events with relationships
    const events = await prisma.event.findMany({
      include: {
        createdBy: { select: { name: true } },
        attendees: { select: { id: true, name: true } },
        _count: {
          select: {
            attendees: true
          }
        }
      },
      orderBy: { startDate: 'asc' }
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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

    // Check if user has permission to create events
    if (user.role === 'STAFF') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const data = await request.json();
    
    // Create event with Prisma
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        type: data.type || 'COMMUNITY',
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : new Date(data.startDate),
        location: data.location,
        maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees) : null,
        actualAttendees: 0,
        requirements: data.requirements,
        contactInfo: data.contactInfo,
        budget: data.budget ? parseFloat(data.budget) : 0,
        status: 'PLANNED',
        isPublic: data.isPublic ?? true,
        createdById: user.id,
      },
      include: {
        createdBy: { select: { name: true } },
        _count: {
          select: {
            attendees: true
          }
        }
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
