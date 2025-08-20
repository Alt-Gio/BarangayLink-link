import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
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

    // Calculate goal statistics
    const [
      totalGoals,
      activeGoals,
      completedGoals,
      pausedGoals,
      cancelledGoals
    ] = await Promise.all([
      prisma.goal.count(),
      prisma.goal.count({ where: { status: 'ACTIVE' } }),
      prisma.goal.count({ where: { status: 'COMPLETED' } }),
      prisma.goal.count({ where: { status: 'PAUSED' } }),
      prisma.goal.count({ where: { status: 'CANCELLED' } })
    ]);

    // Calculate completion rate
    const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // Calculate average progress for active goals
    const averageProgressResult = await prisma.goal.aggregate({
      _avg: { currentValue: true },
      where: { status: 'ACTIVE' }
    });

    const averageProgress = Math.round(averageProgressResult._avg.currentValue || 0);

    // Calculate streak (simplified - days since last goal completion)
    const lastCompletedGoal = await prisma.goal.findFirst({
      where: { status: 'COMPLETED' },
      orderBy: { completedDate: 'desc' }
    });

    let streak = 0;
    if (lastCompletedGoal && lastCompletedGoal.completedDate) {
      const daysSinceCompletion = Math.floor(
        (new Date().getTime() - lastCompletedGoal.completedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      streak = Math.max(0, 30 - daysSinceCompletion); // Simple streak calculation
    }

    // Calculate total points (simplified gamification)
    const totalPoints = (completedGoals * 100) + (activeGoals * 20) + (averageProgress * 5);
    
    // Calculate level
    const level = Math.floor(totalPoints / 500) + 1;

    const stats = {
      totalGoals,
      activeGoals,
      completedGoals,
      completionRate,
      averageProgress,
      streak,
      totalPoints,
      level,
      breakdown: {
        active: activeGoals,
        completed: completedGoals,
        paused: pausedGoals,
        cancelled: cancelledGoals
      }
    };

    console.log('Productivity stats calculated:', stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching productivity stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch productivity statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
