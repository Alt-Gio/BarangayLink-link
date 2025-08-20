import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pending projects (status: PLANNING or PENDING_APPROVAL)
    const pendingProjects = await prisma.project.findMany({
      where: {
        status: {
          in: ['PLANNING', 'PENDING_APPROVAL']
        }
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        },
        manager: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(pendingProjects);
  } catch (error) {
    console.error('Error fetching pending projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending projects' },
      { status: 500 }
    );
  }
}
