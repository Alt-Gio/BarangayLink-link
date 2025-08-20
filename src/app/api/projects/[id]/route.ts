import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ProjectStatus } from '@prisma/client';

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
        createdBy: { select: { name: true, role: true } },
        assignees: { select: { id: true, name: true, role: true } },
        tasks: {
          include: {
            assignees: { select: { id: true, name: true } },
            createdBy: { select: { name: true } },
            _count: {
              select: {
                comments: true,
                attachments: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            assignees: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
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

    // Get existing project to check permissions
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id },
      include: { 
        createdBy: true,
        assignees: true
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check permissions
    const canEdit = 
      user.role === 'ADMIN' ||
      user.role === 'BARANGAY_CAPTAIN' ||
      existingProject.createdById === user.id ||
      existingProject.assignees.some(member => member.id === user.id);

    if (!canEdit) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.name && { title: data.name }), // Support both field names
        ...(data.description && { description: data.description }),
        ...(data.budget !== undefined && { budget: data.budget ? parseFloat(data.budget) : 0 }),
        ...(data.objectives && { objectives: data.objectives }),
        ...(data.beneficiaries && { beneficiaries: data.beneficiaries }),
        ...(data.location && { location: data.location }),
        ...(data.methodology && { methodology: data.methodology }),
        ...(data.expectedOutcome && { expectedOutcome: data.expectedOutcome }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.dueDate && { endDate: new Date(data.dueDate) }), // Support both field names
        ...(data.progress !== undefined && { progress: data.progress }),
        ...(data.progressPercentage !== undefined && { progress: data.progressPercentage }), // Support both field names
        ...(data.status && { status: data.status }),
        ...(data.priority && { priority: data.priority }),
        ...(data.category && { category: data.category }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      },
      include: {
        createdBy: { select: { name: true } },
        assignees: { select: { id: true, name: true } },
        _count: {
          select: {
            tasks: true,
            assignees: true
          }
        }
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
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

    // Only admin or barangay captain can delete projects
    if (user.role !== 'ADMIN' && user.role !== 'BARANGAY_CAPTAIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
