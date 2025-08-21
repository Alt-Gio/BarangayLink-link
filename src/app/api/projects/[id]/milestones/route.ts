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

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        milestones: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project.milestones);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
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

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: params.id }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Create milestone
    const milestone = await prisma.goalMilestone.create({
      data: {
        title: data.title,
        targetValue: data.targetValue || 0,
        reward: data.reward,
        order: data.order || 0,
        goalId: params.id, // Using goalId field for project milestones
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'CREATED',
        description: `Milestone "${data.title}" created for project "${project.name}"`,
        entityType: 'Milestone',
        entityId: milestone.id,
        projectId: params.id,
      }
    });

    return NextResponse.json(milestone, { status: 201 });
  } catch (error) {
    console.error('Error creating milestone:', error);
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

    // Update milestone
    const milestone = await prisma.goalMilestone.update({
      where: { id: data.milestoneId },
      data: {
        title: data.title,
        targetValue: data.targetValue,
        isCompleted: data.isCompleted,
        completedDate: data.isCompleted ? new Date() : null,
        reward: data.reward,
        order: data.order,
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: data.isCompleted ? 'TASK_COMPLETED' : 'UPDATED',
        description: `Milestone "${milestone.title}" ${data.isCompleted ? 'completed' : 'updated'}`,
        entityType: 'Milestone',
        entityId: milestone.id,
        projectId: params.id,
      }
    });

    return NextResponse.json(milestone);
  } catch (error) {
    console.error('Error updating milestone:', error);
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

    const { searchParams } = new URL(request.url);
    const milestoneId = searchParams.get('milestoneId');

    if (!milestoneId) {
      return NextResponse.json({ error: 'Milestone ID is required' }, { status: 400 });
    }

    // Get milestone before deletion for logging
    const milestone = await prisma.goalMilestone.findUnique({
      where: { id: milestoneId }
    });

    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    // Delete milestone
    await prisma.goalMilestone.delete({
      where: { id: milestoneId }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'DELETED',
        description: `Milestone "${milestone.title}" deleted`,
        entityType: 'Milestone',
        entityId: milestoneId,
        projectId: params.id,
      }
    });

    return NextResponse.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
