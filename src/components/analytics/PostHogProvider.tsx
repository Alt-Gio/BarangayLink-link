"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { initPostHog, identifyUser, trackPageView, setUserProperties } from '@/lib/posthog';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  // Initialize PostHog
  useEffect(() => {
    initPostHog();
  }, []);

  // Track page views
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname, document.title);
    }
  }, [pathname]);

  // Identify user when logged in
  useEffect(() => {
    if (isLoaded && user) {
      identifyUser(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        created_at: user.createdAt,
        last_sign_in: user.lastSignInAt,
      });

      // Set additional user properties
      setUserProperties({
        email: user.primaryEmailAddress?.emailAddress,
        full_name: user.fullName,
        first_name: user.firstName,
        last_name: user.lastName,
        profile_image: user.imageUrl,
        email_verified: user.primaryEmailAddress?.verification?.status === 'verified',
        phone_verified: user.primaryPhoneNumber?.verification?.status === 'verified',
      });
    }
  }, [isLoaded, user]);

  return <>{children}</>;
}
