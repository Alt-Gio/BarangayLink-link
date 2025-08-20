import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ProjectCategory, Priority } from '@prisma/client';

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
      // Fetch public projects only
      const projects = await prisma.project.findMany({
        where: { isPublic: true },
        include: {
          createdBy: { select: { name: true } },
          _count: {
            select: {
              tasks: true,
              assignees: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json({ projects });
    }

    // Fetch all projects with relationships
    const projects = await prisma.project.findMany({
      include: {
        createdBy: { select: { name: true } },
        _count: {
          select: {
            tasks: true,
            assignees: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
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

    // Check if user has permission to create projects
    if (user.role === 'STAFF') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const data = await request.json();
    
    // Create project with Prisma
    const project = await prisma.project.create({
      data: {
        title: data.title || data.name,
        description: data.description,
        category: data.category,
        priority: data.priority,
        budget: data.budget ? parseFloat(data.budget) : 0,
        objectives: data.objectives,
        beneficiaries: data.beneficiaries,
        location: data.location,
        methodology: data.methodology,
        expectedOutcome: data.expectedOutcome,
        createdById: user.id,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate || data.dueDate ? new Date(data.endDate || data.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
        status: 'PLANNING',
        progress: 0,
        isPublic: data.isPublic ?? true,
      },
      include: {
        createdBy: { select: { name: true } },
        _count: {
          select: {
            tasks: true,
            assignees: true
          }
        }
      }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
