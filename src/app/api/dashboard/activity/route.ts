import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const limit = 10; // Number of recent activities to fetch

    // Fetch recent activities from different sources
    const [recentProjects, recentTasks, recentEvents, recentDocuments] = await Promise.all([
      // Recent project updates
      prisma.project.findMany({
        take: 3,
        orderBy: { updatedAt: 'desc' },
        include: {
          createdBy: { select: { name: true } }
        }
      }),
      
      // Recent task assignments/updates
      prisma.task.findMany({
        take: 3,
        orderBy: { updatedAt: 'desc' },
        include: {
          createdBy: { select: { name: true } },
          project: { select: { name: true } }
        }
      }),
      
      // Recent events
      prisma.event.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { name: true } }
        }
      }),
      
      // Recent documents
      prisma.document.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: { select: { name: true } }
        }
      })
    ]);

    // Combine and format activities
    const activities = [
      ...recentProjects.map(project => ({
        id: `project-${project.id}`,
        type: 'project',
        title: project.name,
        description: getProjectDescription(project.status, project.progressPercentage),
        time: getRelativeTime(project.updatedAt),
        user: project.createdBy.name,
        status: project.status.toLowerCase()
      })),
      
      ...recentTasks.map(task => ({
        id: `task-${task.id}`,
        type: 'task',
        title: task.title,
        description: `${getTaskDescription(task.status)} ${task.project ? `in ${task.project.name}` : ''}`,
        time: getRelativeTime(task.updatedAt),
        user: task.createdBy.name,
        status: task.status.toLowerCase()
      })),
      
      ...recentEvents.map(event => ({
        id: `event-${event.id}`,
        type: 'event',
        title: event.title,
        description: `Event scheduled for ${new Date(event.startDate).toLocaleDateString()}`,
        time: getRelativeTime(event.createdAt),
        user: event.createdBy.name,
        status: event.status.toLowerCase()
      })),
      
      ...recentDocuments.map(doc => ({
        id: `document-${doc.id}`,
        type: 'document',
        title: doc.filename,
        description: `${doc.type} document uploaded`,
        time: getRelativeTime(doc.createdAt),
        user: doc.uploadedBy.name,
        status: 'uploaded'
      }))
    ];

    // Sort by time and limit results
    const sortedActivities = activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, limit);

    return NextResponse.json(sortedActivities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activities' },
      { status: 500 }
    );
  }
}

function getProjectDescription(status: string, progress: number): string {
  switch (status) {
    case 'PLANNING':
      return 'Project in planning phase';
    case 'IN_PROGRESS':
      return `Project ${progress}% complete`;
    case 'COMPLETED':
      return 'Project completed successfully';
    case 'ON_HOLD':
      return 'Project on hold';
    case 'CANCELLED':
      return 'Project cancelled';
    default:
      return 'Project status updated';
  }
}

function getTaskDescription(status: string): string {
  switch (status) {
    case 'TODO':
      return 'Task created and pending';
    case 'IN_PROGRESS':
      return 'Task in progress';
    case 'REVIEW':
      return 'Task under review';
    case 'DONE':
      return 'Task completed';
    case 'BLOCKED':
      return 'Task blocked';
    default:
      return 'Task updated';
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString();
}
