import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher configuration
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// Client-side Pusher configuration
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: '/api/pusher/auth',
    auth: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  }
);

// Real-time events
export const REALTIME_EVENTS = {
  PROJECT_UPDATED: 'project-updated',
  TASK_UPDATED: 'task-updated',
  TASK_ASSIGNED: 'task-assigned',
  COMMENT_ADDED: 'comment-added',
  USER_TYPING: 'user-typing',
  USER_STOPPED_TYPING: 'user-stopped-typing',
  NOTIFICATION_SENT: 'notification-sent',
  GOAL_UPDATED: 'goal-updated',
  MILESTONE_COMPLETED: 'milestone-completed',
  EVENT_UPDATED: 'event-updated',
  DOCUMENT_UPLOADED: 'document-uploaded',
  ANNOUNCEMENT_PUBLISHED: 'announcement-published',
} as const;

// Channel names
export const CHANNELS = {
  GLOBAL: 'global',
  PROJECT: (projectId: string) => `project-${projectId}`,
  TASK: (taskId: string) => `task-${taskId}`,
  USER: (userId: string) => `private-user-${userId}`,
  DASHBOARD: 'dashboard-updates',
  NOTIFICATIONS: 'notifications',
} as const;

// Helper function to trigger real-time updates
export const triggerRealTimeUpdate = async (
  channel: string,
  event: string,
  data: any
) => {
  try {
    await pusherServer.trigger(channel, event, data);
  } catch (error) {
    console.error('Failed to trigger real-time update:', error);
  }
};
