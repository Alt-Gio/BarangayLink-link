// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://ef6c23ac62d0ac6826036d37501eee4b@o4509879244816384.ingest.us.sentry.io/4509879245930496",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

// Router transition tracking is now handled automatically by Sentry
export const onRouterTransitionStart = () => {
  // This function is no longer needed as Sentry handles router transitions automatically
};