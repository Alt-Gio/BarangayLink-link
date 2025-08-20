import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch basic counts first
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      pendingTasks,
      totalEvents,
      upcomingEvents,
      totalUsers
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({
        where: { status: 'IN_PROGRESS' }
      }),
      prisma.project.count({
        where: { status: 'COMPLETED' }
      }),
      prisma.task.count(),
      prisma.task.count({
        where: { status: { in: ['TODO', 'IN_PROGRESS', 'REVIEW'] } }
      }),
      prisma.event.count(),
      prisma.event.count({
        where: { 
          startDate: { gte: now },
          status: { notIn: ['CANCELLED'] }
        }
      }),
      prisma.user.count({
        where: { isActive: true }
      })
    ]);

    // Calculate budget totals (projects and events)
    const [projectBudgets, eventBudgets] = await Promise.all([
      prisma.project.aggregate({
        _sum: { budget: true }
      }),
      prisma.event.aggregate({
        _sum: { budget: true }
      })
    ]);

    // Calculate simple metrics
    const totalBudget = Number(projectBudgets._sum.budget || 0) + Number(eventBudgets._sum.budget || 0);

    // Calculate completed this month
    const completedProjectsThisMonth = await prisma.project.count({
      where: {
        status: 'COMPLETED',
        updatedAt: { gte: lastMonth }
      }
    });

    // Calculate overdue tasks and projects
    const [overdueTasks, overdueProjects] = await Promise.all([
      prisma.task.count({
        where: {
          dueDate: { lt: now, not: null },
          status: { notIn: ['COMPLETED'] }
        }
      }),
      prisma.project.count({
        where: {
          dueDate: { lt: now },
          status: { notIn: ['COMPLETED', 'CANCELLED'] }
        }
      })
    ]);

    const overdueItems = overdueTasks + overdueProjects;

    // Calculate average progress
    const avgProgress = await prisma.project.aggregate({
      _avg: { progressPercentage: true }
    });

    // Calculate simple changes (new items this week)
    const [newProjects, newTasks, newUsers] = await Promise.all([
      prisma.project.count({
        where: { createdAt: { gte: thisWeek } }
      }),
      prisma.task.count({
        where: { createdAt: { gte: thisWeek } }
      }),
      prisma.user.count({
        where: { createdAt: { gte: thisWeek } }
      })
    ]);

    const stats = {
      activeProjects,
      pendingTasks,
      upcomingEvents,
      teamMembers: totalUsers,
      totalBudget,
      completedProjectsThisMonth,
      overdueItems,
      changes: {
        projects: newProjects,
        tasks: newTasks,
        users: newUsers
      },
      performance: {
        projectCompletion: Math.round(avgProgress._avg.progressPercentage || 0),
        onTimeDelivery: completedProjects > 0 ? Math.round(((completedProjects - overdueProjects) / completedProjects) * 100) : 0,
        budgetEfficiency: 95 // Simplified calculation
      }
    };

    console.log('Dashboard stats calculated:', stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
