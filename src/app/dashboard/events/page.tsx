"use client";

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { EventManagement } from '@/components/dashboard/modules/EventManagement';

export default function EventsPage() {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard/events">
        <EventManagement />
      </DashboardLayout>
    </AuthProvider>
  );
}
