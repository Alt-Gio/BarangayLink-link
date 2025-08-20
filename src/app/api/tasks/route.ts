import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const assignedTo = searchParams.get('assignedTo');
    const status = searchParams.get('status');

    const whereClause: Record<string, unknown> = {};

    if (projectId) {
      whereClause.projectId = projectId;
    }

    if (assignedTo === 'me') {
      whereClause.assignees = {
        some: { id: user.id },
      };
    }

    if (status) {
      whereClause.status = status;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        assignees: {
          select: {
            id: true,
            name: true,
            role: true,
            profileImage: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        checklists: {
          orderBy: { order: 'asc' },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            attachments: true,
            comments: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
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

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.projectId) {
      return NextResponse.json(
        { error: 'Title and project ID are required' },
        { status: 400 }
      );
    }

    // Check if user has access to the project
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      include: { team: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const hasProjectAccess = 
      project.createdById === user.id ||
      project.team.some((member: Record<string, unknown>) => member.id === user.id) ||
      user.role === 'ADMIN' ||
      user.role === 'BARANGAY_CAPTAIN';

    if (!hasProjectAccess) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        estimatedHours: data.estimatedHours ? parseInt(data.estimatedHours) : null,
        projectId: data.projectId,
        createdById: user.id,
        status: 'TODO',
        assignees: data.assigneeIds ? {
          connect: data.assigneeIds.map((id: string) => ({ id }))
        } : undefined,
      },
    });

    // Create checklists if provided
    if (data.checklists && data.checklists.length > 0) {
      await prisma.checklist.createMany({
        data: data.checklists.map((item: string, index: number) => ({
          text: item,
          order: index,
          taskId: task.id,
        })),
      });
    }

    // Fetch the complete task with relations
    const completeTask = await prisma.task.findUnique({
      where: { id: task.id },
      include: {
        project: true,
        assignees: true,
        createdBy: true,
        checklists: true,
      },
    });

    return NextResponse.json(completeTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
