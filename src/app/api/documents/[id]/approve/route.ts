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
    const documentId = params.id;

    // Get the current user to log the approval action
    const currentUser = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the document to update
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        uploadedBy: {
          select: {
            name: true
          }
        }
      }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Update document metadata with approval status
    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        metadata: {
          ...document.metadata,
          approvalStatus: approved ? 'APPROVED' : 'REJECTED',
          approvedBy: currentUser.name,
          approvedAt: new Date().toISOString(),
          isPublic: approved // Make document public if approved
        },
        updatedAt: new Date()
      },
      include: {
        uploadedBy: {
          select: {
            name: true
          }
        }
      }
    });

    // Log the approval action
    await prisma.activityLog.create({
      data: {
        action: approved ? 'DOCUMENT_UPLOADED' : 'DOCUMENT_UPLOADED', // Using same action but different metadata
        description: `Document "${document.originalName}" was ${approved ? 'approved' : 'rejected'} by ${currentUser.name}`,
        entityType: 'Document',
        entityId: documentId,
        userId: currentUser.id,
        documentId: documentId,
        metadata: {
          approved,
          approvedBy: currentUser.name,
          approvedAt: new Date().toISOString(),
          originalUploader: document.uploadedBy.name
        }
      }
    });

    return NextResponse.json({
      message: `Document ${approved ? 'approved' : 'rejected'} successfully`,
      document: updatedDocument
    });
  } catch (error) {
    console.error('Error updating document approval status:', error);
    return NextResponse.json(
      { error: 'Failed to update document status' },
      { status: 500 }
    );
  }
}
