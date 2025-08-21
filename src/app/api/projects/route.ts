import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ProjectCategory, Priority } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    // For TEST MODE: Allow unauthenticated access with limited data
    if (!userId) {
      console.log('No auth - returning public projects only');
      const publicProjects = await prisma.project.findMany({
        where: { isPublic: true },
        include: {
          createdBy: { select: { name: true, role: true } },
          _count: { select: { tasks: true, team: true } }
        },
        take: 10
      });
      
      return NextResponse.json({ 
        projects: publicProjects.map(formatProject),
        total: publicProjects.length,
        accessLevel: 'public'
      });
    }

    // Get current user with role
    const currentUser = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User accessing projects:', { 
      name: currentUser.name, 
      role: currentUser.role 
    });

    // Build access query based on role hierarchy
    let whereClause: any = {};
    
    switch (currentUser.role) {
      case 'ADMIN':
      case 'BARANGAY_CAPTAIN':
        // Level 5-6: Access ALL projects
        whereClause = {};
        break;
        
      case 'SECRETARY':
      case 'TREASURER':
        // Level 4: Department projects + public projects + created projects
        whereClause = {
          OR: [
            { isPublic: true },
            { createdById: currentUser.id },
            { managerId: currentUser.id },
            { team: { some: { id: currentUser.id } } }
          ]
        };
        break;
        
      case 'COUNCILOR':
        // Level 3: Committee projects + created projects + assigned projects
        whereClause = {
          OR: [
            { isPublic: true },
            { createdById: currentUser.id },
            { managerId: currentUser.id },
            { team: { some: { id: currentUser.id } } }
          ]
        };
        break;
        
      case 'STAFF':
        // Level 1: Only assigned projects + public projects
        whereClause = {
          OR: [
            { isPublic: true },
            { team: { some: { id: currentUser.id } } },
            { tasks: { some: { assignees: { some: { id: currentUser.id } } } } }
          ]
        };
        break;
        
      default:
        whereClause = { isPublic: true };
    }

    // Fetch projects based on access level
    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        createdBy: { select: { id: true, name: true, role: true } },
        manager: { select: { id: true, name: true, role: true } },
        team: { select: { id: true, name: true, role: true } },
        _count: {
          select: {
            tasks: true,
            team: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedProjects = projects.map(formatProject);

    return NextResponse.json({ 
      projects: formattedProjects,
      total: formattedProjects.length,
      userRole: currentUser.role,
      accessLevel: getAccessLevel(currentUser.role)
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch projects',
        details: error instanceof Error ? error.message : 'Unknown error',
        projects: []
      },
      { status: 500 }
    );
  }
}

// Helper functions
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
    location: project.location,
    isPublic: project.isPublic,
    objectives: project.objectives,
    beneficiaries: project.beneficiaries,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    createdBy: project.createdBy,
    manager: project.manager,
    team: project.team,
    _count: project._count
  };
}

function getAccessLevel(role: string): string {
  switch (role) {
    case 'ADMIN': return 'full';
    case 'BARANGAY_CAPTAIN': return 'executive';
    case 'SECRETARY':
    case 'TREASURER': return 'departmental';
    case 'COUNCILOR': return 'committee';
    case 'STAFF': return 'assigned';
    default: return 'public';
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

    // Check permissions
    if (user.role === 'STAFF') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.name && !data.title) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    // Create project with Prisma
    const project = await prisma.project.create({
      data: {
        name: data.name || data.title,
        description: data.description || '',
        category: data.category || 'INFRASTRUCTURE',
        priority: data.priority || 'MEDIUM',
        budget: data.budget ? parseFloat(data.budget.toString()) : 0,
        objectives: data.objectives || null,
        beneficiaries: data.beneficiaries || null,
        location: data.location || '',
        methodology: data.methodology || null,
        expectedOutcome: data.expectedOutcome || null,
        createdById: user.id,
        managerId: user.id, // Default manager to creator
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        dueDate: data.endDate || data.dueDate ? new Date(data.endDate || data.dueDate) : null,
        status: 'PLANNING',
        progressPercentage: 0,
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        isArchived: false
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
        action: 'CREATED',
        description: `Project "${project.name}" created`,
        entityType: 'Project',
        entityId: project.id,
        userId: user.id,
        projectId: project.id
      }
    });

    return NextResponse.json(project, { status: 201 });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
