import posthog from 'posthog-js';

export const initPostHog = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('PostHog loaded');
        }
      },
      capture_pageview: false, // We'll handle this manually
      capture_pageleave: true,
      
      // Privacy settings
      respect_dnt: true,
      mask_all_element_attributes: false,
      mask_all_text: false,
      
      // Performance settings
      batch_size: 10,
      request_timeout_ms: 10000,
      
      // Feature flags
      bootstrap: {
        featureFlags: {},
      },
      
      // Session recording (optional - can be disabled for privacy)
      disable_session_recording: process.env.NODE_ENV === 'development',
      
      // Person profiles (for user analytics)
      person_profiles: 'identified_only',
    });
  }
};

// Custom event tracking functions
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && posthog.__loaded) {
    posthog.capture(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }
};

export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && posthog.__loaded) {
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      path,
      title,
    });
  }
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && posthog.__loaded) {
    posthog.identify(userId, {
      ...properties,
      last_seen: new Date().toISOString(),
    });
  }
};

export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && posthog.__loaded) {
    posthog.people.set(properties);
  }
};

export const resetUser = () => {
  if (typeof window !== 'undefined' && posthog.__loaded) {
    posthog.reset();
  }
};

// Barangay-specific tracking events
export const trackBarangayEvent = {
  // Dashboard actions
  dashboardViewed: () => trackEvent('dashboard_viewed'),
  moduleAccessed: (module: string) => trackEvent('module_accessed', { module }),
  
  // Project management
  projectCreated: (projectId: string, category: string) => 
    trackEvent('project_created', { project_id: projectId, category }),
  projectUpdated: (projectId: string, field: string) => 
    trackEvent('project_updated', { project_id: projectId, field }),
  projectCompleted: (projectId: string, budget: number) => 
    trackEvent('project_completed', { project_id: projectId, budget }),
  
  // Task management
  taskCreated: (taskId: string, projectId: string) => 
    trackEvent('task_created', { task_id: taskId, project_id: projectId }),
  taskAssigned: (taskId: string, assigneeId: string) => 
    trackEvent('task_assigned', { task_id: taskId, assignee_id: assigneeId }),
  taskCompleted: (taskId: string, timeSpent?: number) => 
    trackEvent('task_completed', { task_id: taskId, time_spent_hours: timeSpent }),
  
  // Goal tracking
  goalCreated: (goalId: string, type: string, category: string) => 
    trackEvent('goal_created', { goal_id: goalId, type, category }),
  goalUpdated: (goalId: string, progress: number) => 
    trackEvent('goal_updated', { goal_id: goalId, progress }),
  milestoneCompleted: (goalId: string, milestoneId: string) => 
    trackEvent('milestone_completed', { goal_id: goalId, milestone_id: milestoneId }),
  
  // Event management
  eventCreated: (eventId: string, type: string, isPublic: boolean) => 
    trackEvent('event_created', { event_id: eventId, type, is_public: isPublic }),
  eventRegistration: (eventId: string) => 
    trackEvent('event_registration', { event_id: eventId }),
  
  // Document management
  documentUploaded: (documentId: string, type: string, size: number) => 
    trackEvent('document_uploaded', { document_id: documentId, type, size_mb: size / 1024 / 1024 }),
  documentDownloaded: (documentId: string) => 
    trackEvent('document_downloaded', { document_id: documentId }),
  
  // Financial tracking
  budgetAllocated: (amount: number, category: string) => 
    trackEvent('budget_allocated', { amount, category }),
  expenseRecorded: (amount: number, projectId?: string) => 
    trackEvent('expense_recorded', { amount, project_id: projectId }),
  
  // Real-time collaboration
  collaborationSession: (type: string, participants: number) => 
    trackEvent('collaboration_session', { type, participant_count: participants }),
  messagesSent: (channel: string, count: number) => 
    trackEvent('messages_sent', { channel, message_count: count }),
  
  // PWA actions
  pwaInstalled: () => trackEvent('pwa_installed'),
  pwaLaunched: () => trackEvent('pwa_launched'),
  offlineUsage: (duration: number) => trackEvent('offline_usage', { duration_minutes: duration }),
  
  // Search and filters
  searchPerformed: (query: string, module: string, resultsCount: number) => 
    trackEvent('search_performed', { query: query.substring(0, 50), module, results_count: resultsCount }),
  filterApplied: (module: string, filters: Record<string, any>) => 
    trackEvent('filter_applied', { module, ...filters }),
  
  // Error tracking (complement to Sentry)
  userError: (errorType: string, context: string) => 
    trackEvent('user_error', { error_type: errorType, context }),
  featureUsage: (feature: string, successful: boolean) => 
    trackEvent('feature_usage', { feature, successful }),
};

export default posthog;
