import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  tracesSampleRate: 1.0,

  // Configure the environment
  environment: process.env.NODE_ENV,

  // Configure error filtering for server-side
  beforeSend: (event, hint) => {
    // Filter out expected errors
    if (event.exception) {
      const error = hint.originalException;
      
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message).toLowerCase();
        
        // Filter out database connection errors in development
        if (process.env.NODE_ENV === 'development' && message.includes('database')) {
          return null;
        }
        
        // Filter out authentication errors (these are expected)
        if (message.includes('unauthorized') || message.includes('unauthenticated')) {
          return null;
        }
      }
    }

    return event;
  },

  // Configure server-specific options
  integrations: [
    // Add server-specific integrations here if needed
  ],

  // Add server context
  initialScope: {
    tags: {
      component: 'barangay-management-server',
    },
  },
});
