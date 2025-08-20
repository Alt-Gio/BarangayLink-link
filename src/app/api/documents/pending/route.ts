import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pending documents (not yet approved/rejected)
    // We'll use a metadata field to track approval status
    const pendingDocuments = await prisma.document.findMany({
      where: {
        OR: [
          {
            metadata: {
              path: ['approvalStatus'],
              equals: 'PENDING'
            }
          },
          {
            metadata: {
              path: ['approvalStatus'],
              equals: null
            }
          }
        ]
      },
      include: {
        uploadedBy: {
          select: {
            name: true
          }
        },
        project: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(pendingDocuments);
  } catch (error) {
    console.error('Error fetching pending documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending documents' },
      { status: 500 }
    );
  }
}
