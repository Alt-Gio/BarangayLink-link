import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { approved } = await request.json();
    const projectId = params.id;

    // Get the current user to log the approval action
    const currentUser = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update project status
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: approved ? 'APPROVED' : 'CANCELLED',
        updatedAt: new Date()
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Log the approval action
    await prisma.activityLog.create({
      data: {
        action: approved ? 'PROJECT_APPROVED' : 'PROJECT_CANCELLED',
        description: `Project "${updatedProject.name}" was ${approved ? 'approved' : 'rejected'} by ${currentUser.name}`,
        entityType: 'Project',
        entityId: projectId,
        userId: currentUser.id,
        projectId: projectId,
        metadata: {
          approved,
          approvedBy: currentUser.name,
          approvedAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      message: `Project ${approved ? 'approved' : 'rejected'} successfully`,
      project: updatedProject
    });
  } catch (error) {
    console.error('Error updating project approval status:', error);
    return NextResponse.json(
      { error: 'Failed to update project status' },
      { status: 500 }
    );
  }
}
