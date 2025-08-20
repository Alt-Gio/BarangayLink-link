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
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const whereClause: Record<string, unknown> = {};

    if (type && type !== 'ALL') {
      whereClause.type = type;
    }

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    // Fetch goals with relationships
    const goals = await prisma.goal.findMany({
      where: whereClause,
      include: {
        createdBy: { select: { name: true } },
        assignees: { select: { id: true, name: true } },
        milestones: {
          orderBy: { order: 'asc' }
        },
        metrics: {
          orderBy: { date: 'desc' },
          take: 10
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
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

    const data = await request.json();
    
    // Create goal with Prisma
    const goal = await prisma.goal.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        category: data.category,
        priority: data.priority || 'MEDIUM',
        targetValue: parseFloat(data.targetValue),
        currentValue: data.currentValue ? parseFloat(data.currentValue) : 0,
        unit: data.unit,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        targetDate: new Date(data.targetDate),
        rewards: data.rewards || [],
        createdById: user.id,
        assignees: data.assigneeIds ? {
          connect: data.assigneeIds.map((id: string) => ({ id }))
        } : undefined,
      },
      include: {
        createdBy: { select: { name: true } },
        assignees: { select: { id: true, name: true } },
        milestones: true,
        metrics: true
      }
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
