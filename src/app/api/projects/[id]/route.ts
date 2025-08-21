import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    // For TEST MODE: Allow unauthenticated access to public projects
    if (!userId) {
      const publicProject = await prisma.project.findUnique({
        where: { 
          id: params.id,
          isPublic: true 
        },
        include: {
          createdBy: { select: { name: true, role: true } },
          _count: { select: { tasks: true, team: true } }
        }
      });

      if (!publicProject) {
        return NextResponse.json({ error: 'Project not found or not public' }, { status: 404 });
      }

      return NextResponse.json(formatProject(publicProject));
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        createdBy: { 
          select: { 
            id: true,
            name: true, 
            role: true 
          } 
        },
        manager: {
          select: { 
            id: true,
            name: true, 
            role: true 
          } 
        },
        team: {
          select: { 
            id: true,
            name: true, 
            role: true 
          } 
        },
        tasks: {
          include: {
            assignees: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          }
        },
        _count: {
          select: {
            tasks: true,
            team: true
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check access permissions based on role hierarchy
    const hasAccess = checkProjectAccess(currentUser, project);
    
    if (!hasAccess) {
      return NextResponse.json({ 
        error: 'Access denied. You do not have permission to view this project.' 
      }, { status: 403 });
    }

    return NextResponse.json(formatProject(project));

  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to check project access based on role hierarchy
function checkProjectAccess(user: any, project: any): boolean {
  // Public projects are accessible to everyone
  if (project.isPublic) return true;

  // Admin and Captain have access to all projects
  if (user.role === 'ADMIN' || user.role === 'BARANGAY_CAPTAIN') return true;

  // User created the project
  if (project.createdById === user.id) return true;

  // User is the project manager
  if (project.managerId === user.id) return true;

  // User is on the project team
  if (project.team.some((member: any) => member.id === user.id)) return true;

  // User has assigned tasks in this project
  if (project.tasks.some((task: any) => 
    task.assignees.some((assignee: any) => assignee.id === user.id)
  )) return true;

  return false;
}

// Helper function to format project data
function formatProject(project: any) {
  return {
    id: project.id,
    title: project.name,
    name: project.name,
    description: project.description,
    status: project.status,
    category: project.category,
    priority: project.priority,
    budget: Number(project.budget || 0),
    expenditure: Number(project.expenditure || 0),
    progressPercentage: project.progressPercentage,
    progress: project.progressPercentage,
    startDate: project.startDate?.toISOString(),
    endDate: project.dueDate?.toISOString(),
    dueDate: project.dueDate?.toISOString(),
    location: project.location,
    isPublic: project.isPublic,
    isArchived: project.isArchived,
    objectives: project.objectives,
    beneficiaries: project.beneficiaries,
    methodology: project.methodology,
    expectedOutcome: project.expectedOutcome,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    createdBy: project.createdBy,
    manager: project.manager,
    team: project.team,
    tasks: project.tasks,
    _count: project._count
  };
}

export async function PUT(
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

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id }
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const data = await request.json();

    // Update project
    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        name: data.name || data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        budget: data.budget ? parseFloat(data.budget.toString()) : 0,
        objectives: data.objectives,
        beneficiaries: data.beneficiaries,
        location: data.location,
        methodology: data.methodology,
        expectedOutcome: data.expectedOutcome,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        dueDate: data.endDate || data.dueDate ? new Date(data.endDate || data.dueDate) : undefined,
        status: data.status,
        isPublic: data.isPublic,
        isArchived: data.isArchived
      },
      include: {
        createdBy: { 
          select: { 
            id: true,
            name: true, 
            role: true 
          } 
        },
        manager: {
          select: { 
            id: true,
            name: true, 
            role: true 
          } 
        },
        team: {
          select: { 
            id: true,
            name: true, 
            role: true 
          } 
        },
        _count: {
          select: {
            tasks: true,
            team: true
          }
        }
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'UPDATED',
        description: `Project "${project.name}" updated`,
        entityType: 'Project',
        entityId: project.id,
        userId: user.id,
        projectId: project.id
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: params.id }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete project (this will cascade delete related records)
    await prisma.project.delete({
      where: { id: params.id }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'DELETED',
        description: `Project "${project.name}" deleted`,
        entityType: 'Project',
        entityId: project.id,
        userId: user.id
      }
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


