import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma, taskHelpers, userHelpers, logActivity } from '@/lib/db';
import { TaskStatus, ActivityAction } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await userHelpers.getUserByClerkId(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: {
        project: {
          include: {
            manager: true,
            team: true,
          },
        },
        assignees: {
          select: {
            id: true,
            name: true,
            role: true,
            profileImage: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true,
            profileImage: true,
          },
        },
        checklists: {
          orderBy: { order: 'asc' },
        },
        attachments: {
          orderBy: { uploadedAt: 'desc' },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
                profileImage: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          include: {
            uploadedBy: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check if user has access to this task
    const hasAccess = 
      task.assignees.some(assignee => assignee.id === user.id) ||
      task.createdById === user.id ||
      task.project.managerId === user.id ||
      task.project.team.some(member => member.id === user.id) ||
      user.role === 'ADMIN' ||
      user.role === 'BARANGAY_CAPTAIN';

    if (!hasAccess) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
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

    const user = await userHelpers.getUserByClerkId(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await request.json();

    // Get existing task to check permissions
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
      include: {
        project: {
          include: { manager: true, team: true },
        },
        assignees: true,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check permissions
    const canEdit = 
      existingTask.assignees.some(assignee => assignee.id === user.id) ||
      existingTask.createdById === user.id ||
      existingTask.project.managerId === user.id ||
      existingTask.project.team.some(member => member.id === user.id) ||
      user.role === 'ADMIN' ||
      user.role === 'BARANGAY_CAPTAIN' ||
      user.role === 'COUNCILOR';

    if (!canEdit) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Handle status changes separately for activity logging
    if (data.status && data.status !== existingTask.status) {
      const task = await taskHelpers.updateTaskStatus(
        params.id,
        data.status as TaskStatus,
        user.id
      );
      return NextResponse.json(task);
    }

    // Regular update
    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.priority && { priority: data.priority }),
        ...(data.dueDate !== undefined && { 
          dueDate: data.dueDate ? new Date(data.dueDate) : null 
        }),
        ...(data.estimatedHours !== undefined && { estimatedHours: data.estimatedHours }),
        ...(data.actualHours !== undefined && { actualHours: data.actualHours }),
        ...(data.assigneeIds && {
          assignees: {
            set: data.assigneeIds.map((id: string) => ({ id })),
          },
        }),
      },
      include: {
        project: true,
        assignees: true,
        createdBy: true,
        checklists: true,
      },
    });

    await logActivity(
      user.id,
      ActivityAction.UPDATED,
      `Task "${updatedTask.title}" updated`,
      'Task',
      updatedTask.id,
      existingTask,
      updatedTask
    );

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
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

    const user = await userHelpers.getUserByClerkId(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: {
        project: {
          include: { manager: true, team: true },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check permissions - only creators, project managers, or admin can delete
    const canDelete = 
      task.createdById === user.id ||
      task.project.managerId === user.id ||
      user.role === 'ADMIN' ||
      user.role === 'BARANGAY_CAPTAIN' ||
      user.role === 'COUNCILOR';

    if (!canDelete) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    await prisma.task.delete({
      where: { id: params.id },
    });

    await logActivity(
      user.id,
      ActivityAction.DELETED,
      `Task "${task.title}" deleted`,
      'Task',
      task.id,
      task,
      null
    );

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
