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

    // Get all projects with their tasks
    const projects = await prisma.project.findMany({
      include: {
        tasks: true,
        _count: {
          select: {
            tasks: true,
            assignees: true,
          },
        },
      },
    });

    // Calculate success metrics
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const inProgressProjects = projects.filter(p => p.status === 'IN_PROGRESS').length;
    const plannedProjects = projects.filter(p => p.status === 'PLANNING').length;

    // On-time completion rate
    const completedProjectsWithDeadlines = projects.filter(p => 
      p.status === 'COMPLETED' && p.dueDate && p.completedDate
    );
    
    const onTimeCompleted = completedProjectsWithDeadlines.filter(p => 
      new Date(p.completedDate!) <= new Date(p.dueDate!)
    ).length;
    
    const onTimeCompletionRate = completedProjectsWithDeadlines.length > 0 
      ? Math.round((onTimeCompleted / completedProjectsWithDeadlines.length) * 100)
      : 0;

    // Budget utilization efficiency
    const projectsWithBudget = projects.filter(p => p.budget && p.budget > 0);
    const totalBudget = projectsWithBudget.reduce((sum, p) => sum + Number(p.budget), 0);
    const totalExpenditure = projectsWithBudget.reduce((sum, p) => sum + Number(p.expenditure || 0), 0);
    const budgetUtilizationRate = totalBudget > 0 
      ? Math.round((totalExpenditure / totalBudget) * 100)
      : 0;

    // Team productivity metrics
    const totalTasks = projects.reduce((sum, p) => sum + p._count.tasks, 0);
    const completedTasks = projects.reduce((sum, p) => 
      sum + p.tasks.filter(t => t.status === 'COMPLETED').length, 0
    );
    const taskCompletionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    // Average project duration
    const completedProjectsWithDates = projects.filter(p => 
      p.status === 'COMPLETED' && p.startDate && p.completedDate
    );
    
    const averageDuration = completedProjectsWithDates.length > 0
      ? completedProjectsWithDates.reduce((sum, p) => {
          const duration = new Date(p.completedDate!).getTime() - new Date(p.startDate!).getTime();
          return sum + duration;
        }, 0) / completedProjectsWithDates.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0;

    // Milestone achievement tracking
    const projectsWithMilestones = projects.filter(p => p.milestones);
    const totalMilestones = projectsWithMilestones.reduce((sum, p) => {
      const milestones = p.milestones as any[];
      return sum + (milestones?.length || 0);
    }, 0);

    const completedMilestones = projectsWithMilestones.reduce((sum, p) => {
      const milestones = p.milestones as any[];
      return sum + (milestones?.filter((m: any) => m.isCompleted)?.length || 0);
    }, 0);

    const milestoneCompletionRate = totalMilestones > 0 
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;

    // Category performance
    const categoryStats = projects.reduce((acc, project) => {
      const category = project.category;
      if (!acc[category]) {
        acc[category] = { total: 0, completed: 0, inProgress: 0 };
      }
      acc[category].total++;
      if (project.status === 'COMPLETED') acc[category].completed++;
      if (project.status === 'IN_PROGRESS') acc[category].inProgress++;
      return acc;
    }, {} as Record<string, { total: number; completed: number; inProgress: number }>);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await prisma.activityLog.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
        entityType: 'Project',
      },
      include: {
        user: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const stats = {
      overview: {
        totalProjects,
        completedProjects,
        inProgressProjects,
        plannedProjects,
        completionRate: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0,
      },
      performance: {
        onTimeCompletionRate,
        budgetUtilizationRate,
        taskCompletionRate,
        averageDuration: Math.round(averageDuration),
        milestoneCompletionRate,
      },
      productivity: {
        totalTasks,
        completedTasks,
        totalBudget: Math.round(totalBudget),
        totalExpenditure: Math.round(totalExpenditure),
        totalMilestones,
        completedMilestones,
      },
      categoryPerformance: categoryStats,
      recentActivity,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
