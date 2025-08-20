import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  tracesSampleRate: 1.0,

  // Configure the environment
  environment: process.env.NODE_ENV,

  // Edge runtime specific configuration
  initialScope: {
    tags: {
      component: 'barangay-management-edge',
    },
  },
});
