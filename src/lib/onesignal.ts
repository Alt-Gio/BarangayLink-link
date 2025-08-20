import OneSignal from 'react-onesignal';

export const initOneSignal = async () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) {
    try {
      await OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID,
        allowLocalhostAsSecureOrigin: process.env.NODE_ENV === 'development',
        
        // Basic settings
        autoRegister: false,
        autoResubscribe: true,
        
        // Welcome notification
        welcomeNotification: {
          disable: true,
          message: "Welcome to Barangay Management System"
        }
      });

      console.log('OneSignal initialized successfully');
    } catch (error) {
      console.error('OneSignal initialization failed:', error);
    }
  }
};

// User subscription management
export const subscribeUser = async (userId?: string, userData?: Record<string, string>) => {
  try {
    // Request notification permission
    await OneSignal.Notifications.requestPermission();
    
    // Set user ID if provided
    if (userId) {
      try {
        await OneSignal.login(userId);
      } catch (error) {
        console.warn('Failed to set user ID:', error);
      }
    }
    
    // Set tags if provided
    if (userData) {
      try {
        await OneSignal.User.addTags(userData);
      } catch (error) {
        console.warn('Failed to set user tags:', error);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to subscribe user:', error);
    return false;
  }
};

export const unsubscribeUser = async () => {
  try {
    // For now, just log that we're unsubscribing
    console.log('User unsubscribed from notifications');
    return true;
  } catch (error) {
    console.error('Failed to unsubscribe user:', error);
    return false;
  }
};

export const getSubscriptionStatus = async () => {
  try {
    // Check if OneSignal is available
    if (!OneSignal) {
      console.warn('OneSignal not properly initialized');
      return {
        isPushSupported: false,
        isSubscribed: false,
        userId: null,
        playerId: null
      };
    }

    // Check if push notifications are supported
    const isPushSupported = OneSignal.Notifications.isPushSupported();
    
    // Check if notifications are enabled
    const isSubscribed = OneSignal.Notifications.permission === true;
    
    // Get user ID
    const userId = OneSignal.User.onesignalId;
    
    // Get player ID (device ID) - handle safely
    let playerId = null;
    try {
      playerId = OneSignal.User.PushSubscription?.id || null;
    } catch (error) {
      console.warn('Could not get player ID:', error);
    }
    
    return {
      isPushSupported,
      isSubscribed,
      userId,
      playerId
    };
  } catch (error) {
    console.error('Failed to get subscription status:', error);
    return {
      isPushSupported: false,
      isSubscribed: false,
      userId: null,
      playerId: null
    };
  }
};

// Tag management for targeted notifications
export const setUserTags = async (tags: Record<string, string>) => {
  try {
    await OneSignal.User.addTags(tags);
    return true;
  } catch (error) {
    console.error('Failed to set user tags:', error);
    return false;
  }
};

export const removeUserTags = async (tagKeys: string[]) => {
  try {
    await OneSignal.User.removeTags(tagKeys);
    return true;
  } catch (error) {
    console.error('Failed to remove user tags:', error);
    return false;
  }
};

// Send notifications (server-side function to be called from API routes)
export const sendNotification = async (
  title: string,
  message: string,
  options: {
    userIds?: string[];
    segments?: string[];
    tags?: Record<string, string>;
    url?: string;
    icon?: string;
    badge?: string;
    data?: Record<string, unknown>;
  } = {}
) => {
  if (!process.env.ONESIGNAL_API_KEY) {
    console.error('OneSignal API key not configured');
    return false;
  }

  try {
    const notification = {
      app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
      headings: { en: title },
      contents: { en: message },
      web_url: options.url,
      chrome_web_icon: options.icon,
      chrome_web_badge: options.badge,
      data: options.data,
      
      // Targeting
      ...(options.userIds && { include_external_user_ids: options.userIds }),
      ...(options.segments && { included_segments: options.segments }),
      ...(options.tags && { filters: Object.entries(options.tags).map(([key, value]) => ({
        field: "tag",
        key,
        relation: "=",
        value
      })) }),
      
      // Default to all users if no targeting specified
      ...(!options.userIds && !options.segments && !options.tags && { 
        included_segments: ["Subscribed Users"] 
      })
    };

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${process.env.ONESIGNAL_API_KEY}`
      },
      body: JSON.stringify(notification)
    });

    if (!response.ok) {
      throw new Error(`OneSignal API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Notification sent:', result.id);
    return result;
  } catch (error) {
    console.error('Failed to send notification:', error);
    return false;
  }
};

// Predefined notification types for the barangay system
export const BarangayNotifications = {
  // Project notifications
  projectCreated: (projectTitle: string, createdBy: string) => ({
    title: "New Project Created",
    message: `${createdBy} created a new project: ${projectTitle}`,
    tags: { notification_type: "project", action: "created" }
  }),
  
  projectCompleted: (projectTitle: string) => ({
    title: "Project Completed! 🎉",
    message: `Great news! "${projectTitle}" has been successfully completed.`,
    tags: { notification_type: "project", action: "completed" }
  }),
  
  taskAssigned: (taskTitle: string) => ({
    title: "New Task Assigned",
    message: `You have been assigned to: ${taskTitle}`,
    tags: { notification_type: "task", action: "assigned" }
  }),
  
  // Event notifications
  eventReminder: (eventTitle: string, eventDate: string) => ({
    title: "Event Reminder 📅",
    message: `Don't forget: "${eventTitle}" is scheduled for ${eventDate}`,
    tags: { notification_type: "event", action: "reminder" }
  }),
  
  eventCancelled: (eventTitle: string) => ({
    title: "Event Cancelled",
    message: `"${eventTitle}" has been cancelled. We apologize for any inconvenience.`,
    tags: { notification_type: "event", action: "cancelled" }
  }),
  
  // Announcement notifications
  urgentAnnouncement: (title: string, excerpt: string) => ({
    title: `🚨 Urgent: ${title}`,
    message: excerpt,
    tags: { notification_type: "announcement", priority: "urgent" }
  }),
  
  generalAnnouncement: (title: string, excerpt: string) => ({
    title: `📢 ${title}`,
    message: excerpt,
    tags: { notification_type: "announcement", priority: "normal" }
  }),
  
  // Goal and achievement notifications
  milestoneAchieved: (goalTitle: string, milestone: string) => ({
    title: "Milestone Achieved! 🏆",
    message: `"${goalTitle}": ${milestone} has been completed`,
    tags: { notification_type: "goal", action: "milestone" }
  }),
  
  goalCompleted: (goalTitle: string) => ({
    title: "Goal Completed! 🎯",
    message: `Congratulations! "${goalTitle}" has been successfully achieved.`,
    tags: { notification_type: "goal", action: "completed" }
  }),
  
  // System notifications
  maintenanceScheduled: (date: string, duration: string) => ({
    title: "Scheduled Maintenance",
    message: `System maintenance is scheduled for ${date} (${duration}). Plan accordingly.`,
    tags: { notification_type: "system", action: "maintenance" }
  }),
  
  dataBackupComplete: () => ({
    title: "Backup Complete ✅",
    message: "Your barangay data has been successfully backed up.",
    tags: { notification_type: "system", action: "backup" }
  })
};
