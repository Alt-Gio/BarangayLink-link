import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { triggerRealTimeUpdate, CHANNELS, REALTIME_EVENTS } from '@/lib/pusher';
import { sendNotification, BarangayNotifications } from '@/lib/onesignal';
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

    const { type, data, channels = ['push', 'realtime'], recipients } = await request.json();

    // Validate request
    if (!type || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const results = {
      push: { success: false, id: null },
      realtime: { success: false },
      email: { success: false, count: 0 }
    };

    // Send push notification
    if (channels.includes('push')) {
      try {
        let notification;
        
        switch (type) {
          case 'project-created':
            notification = BarangayNotifications.projectCreated(data.projectTitle, user.name);
            break;
          case 'project-completed':
            notification = BarangayNotifications.projectCompleted(data.projectTitle);
            break;
          case 'task-assigned':
            notification = BarangayNotifications.taskAssigned(data.taskTitle, data.assigneeName);
            break;
          case 'event-reminder':
            notification = BarangayNotifications.eventReminder(data.eventTitle, data.eventDate);
            break;
          case 'urgent-announcement':
            notification = BarangayNotifications.urgentAnnouncement(data.title, data.excerpt);
            break;
          case 'milestone-achieved':
            notification = BarangayNotifications.milestoneAchieved(data.goalTitle, data.milestone);
            break;
          default:
            notification = {
              title: data.title || 'BarangayLink Notification',
              message: data.message || 'You have a new update',
              tags: { notification_type: type }
            };
        }

        const pushResult = await sendNotification(
          notification.title,
          notification.message,
          {
            userIds: recipients?.userIds,
            segments: recipients?.segments,
            tags: notification.tags,
            url: data.url,
            data: { type, ...data }
          }
        );

        if (pushResult) {
          results.push = { success: true, id: pushResult.id };
        }
      } catch (error) {
        console.error('Push notification failed:', error);
      }
    }

    // Send real-time update
    if (channels.includes('realtime')) {
      try {
        let eventType;
        let channel;
        
        switch (type) {
          case 'project-created':
          case 'project-updated':
          case 'project-completed':
            eventType = REALTIME_EVENTS.PROJECT_UPDATED;
            channel = data.projectId ? CHANNELS.PROJECT(data.projectId) : CHANNELS.DASHBOARD;
            break;
          case 'task-assigned':
          case 'task-updated':
            eventType = REALTIME_EVENTS.TASK_UPDATED;
            channel = data.taskId ? CHANNELS.TASK(data.taskId) : CHANNELS.DASHBOARD;
            break;
          case 'goal-updated':
            eventType = REALTIME_EVENTS.GOAL_UPDATED;
            channel = CHANNELS.DASHBOARD;
            break;
          case 'milestone-achieved':
            eventType = REALTIME_EVENTS.MILESTONE_COMPLETED;
            channel = CHANNELS.DASHBOARD;
            break;
          case 'event-updated':
            eventType = REALTIME_EVENTS.EVENT_UPDATED;
            channel = CHANNELS.DASHBOARD;
            break;
          case 'announcement-published':
            eventType = REALTIME_EVENTS.ANNOUNCEMENT_PUBLISHED;
            channel = CHANNELS.GLOBAL;
            break;
          default:
            eventType = REALTIME_EVENTS.NOTIFICATION_SENT;
            channel = CHANNELS.DASHBOARD;
        }

        await triggerRealTimeUpdate(channel, eventType, {
          type,
          title: data.title || 'Update',
          message: data.message || 'Something happened',
          timestamp: new Date().toISOString(),
          userId: user.id,
          userName: user.name,
          ...data
        });

        results.realtime = { success: true };
      } catch (error) {
        console.error('Real-time update failed:', error);
      }
    }

    // Send email notification (for important updates)
    if (channels.includes('email') && recipients?.emails) {
      try {
        let template;
        
        switch (type) {
          case 'project-assigned':
            template = EmailTemplates.projectAssignment(
              data.userName,
              data.projectTitle,
              data.projectUrl,
              user.name
            );
            break;
          case 'task-assigned':
            template = EmailTemplates.taskAssignment(
              data.userName,
              data.taskTitle,
              data.taskUrl,
              data.dueDate
            );
            break;
          case 'urgent-announcement':
            template = EmailTemplates.urgentAnnouncement(
              data.title,
              data.content,
              data.announcementUrl
            );
            break;
          default:
            // Skip email for other types
            break;
        }

        if (template) {
          let emailCount = 0;
          for (const email of recipients.emails) {
            const emailResult = await sendEmail(email, template);
            if (emailResult.success) {
              emailCount++;
            }
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          results.email = { success: emailCount > 0, count: emailCount };
        }
      } catch (error) {
        console.error('Email notification failed:', error);
      }
    }

    // Log the notification activity
    await prisma.activityLog.create({
      data: {
        action: 'NOTIFICATION_SENT',
        description: `Sent ${type} notification via ${channels.join(', ')}`,
        entityType: 'NOTIFICATION',
        entityId: `notification-${Date.now()}`,
        userId: user.id,
        metadata: {
          notificationType: type,
          channels,
          results,
          recipientCount: {
            push: recipients?.userIds?.length || 0,
            email: recipients?.emails?.length || 0
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Notifications sent',
      results
    });

  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
