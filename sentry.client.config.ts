import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  tracesSampleRate: 1.0,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Configure which environment this is
  environment: process.env.NODE_ENV,

  // Configure error filtering
  beforeSend: (event, hint) => {
    // Filter out known non-critical errors
    if (event.exception) {
      const error = hint.originalException;
      
      // Filter out network errors that aren't actionable
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message).toLowerCase();
        if (
          message.includes('network error') ||
          message.includes('fetch failed') ||
          message.includes('load failed') ||
          message.includes('non-error promise rejection')
        ) {
          return null;
        }
      }
    }

    return event;
  },

  // Set up error boundaries
  integrations: [
    Sentry.replayIntegration({
      // Mask all text and inputs for privacy
      maskAllText: true,
      maskAllInputs: true,
      // Don't record on localhost
      blockAllMedia: process.env.NODE_ENV === 'development',
    }),
  ],

  // Configure tags for better filtering
  initialScope: {
    tags: {
      component: 'barangay-management',
    },
  },
});
