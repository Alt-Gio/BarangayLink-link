import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, EmailTemplates } from '@/lib/resend';

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

    const { type, recipients, data } = await request.json();

    // Validate request
    if (!type || !recipients || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check permissions - only certain roles can send system emails
    const canSendEmails = ['ADMIN', 'BARANGAY_CAPTAIN', 'SECRETARY'].includes(user.role);
    if (!canSendEmails) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    let template;
    let emailAddresses: string[] = [];

    // Resolve recipients
    if (Array.isArray(recipients)) {
      emailAddresses = recipients;
    } else if (recipients === 'all-users') {
      const users = await prisma.user.findMany({
        where: { isActive: true },
        select: { email: true }
      });
      emailAddresses = users.map(u => u.email);
    } else if (recipients === 'officials') {
      const officials = await prisma.user.findMany({
        where: { 
          isActive: true,
          role: { in: ['ADMIN', 'BARANGAY_CAPTAIN', 'SECRETARY', 'TREASURER', 'COUNCILOR'] }
        },
        select: { email: true }
      });
      emailAddresses = officials.map(u => u.email);
    }

    // Generate email template based on type
    switch (type) {
      case 'project-assignment':
        template = EmailTemplates.projectAssignment(
          data.userName,
          data.projectTitle,
          data.projectUrl,
          user.name
        );
        break;

      case 'task-assignment':
        template = EmailTemplates.taskAssignment(
          data.userName,
          data.taskTitle,
          data.taskUrl,
          data.dueDate
        );
        break;

      case 'event-invitation':
        template = EmailTemplates.eventInvitation(
          data.userName,
          data.eventTitle,
          data.eventDate,
          data.eventLocation,
          data.eventUrl
        );
        break;

      case 'urgent-announcement':
        template = EmailTemplates.urgentAnnouncement(
          data.title,
          data.content,
          data.announcementUrl
        );
        break;

      case 'welcome':
        template = EmailTemplates.welcomeEmail(
          data.userName,
          data.dashboardUrl
        );
        break;

      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    // Send emails
    const results = [];
    for (const email of emailAddresses) {
      try {
        const result = await sendEmail(email, template);
        results.push({ email, success: result.success });
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        results.push({ email, success: false });
      }
    }

    // Log the activity
    await prisma.activityLog.create({
      data: {
        action: 'EMAIL_SENT',
        description: `Sent ${type} email to ${emailAddresses.length} recipients`,
        entityType: 'EMAIL',
        entityId: 'bulk-email',
        userId: user.id,
        metadata: {
          emailType: type,
          recipientCount: emailAddresses.length,
          successCount: results.filter(r => r.success).length
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Email sent to ${results.filter(r => r.success).length} of ${results.length} recipients`,
      results
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
