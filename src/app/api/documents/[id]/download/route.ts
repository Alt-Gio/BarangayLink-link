import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documentId = params.id;

    // Get the document
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check if user has permission to access this document
    const currentUser = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // For now, allow access to all documents for approval purposes
    // In a real app, you'd check document permissions here

    try {
      // Try to read the file from the filepath
      const filePath = join(process.cwd(), document.filepath);
      const fileBuffer = readFileSync(filePath);

      // Increment download count
      await prisma.document.update({
        where: { id: documentId },
        data: {
          downloadCount: {
            increment: 1
          },
          lastAccessed: new Date()
        }
      });

      // Return the file with appropriate headers
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': document.mimetype,
          'Content-Disposition': `inline; filename="${document.originalName}"`,
          'Content-Length': fileBuffer.length.toString()
        }
      });
    } catch (fileError) {
      console.error('Error reading file:', fileError);
      
      // If file doesn't exist, return a placeholder response
      return new NextResponse(
        `Document "${document.originalName}" is not available for preview.`,
        {
          status: 404,
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      );
    }
  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    );
  }
}
