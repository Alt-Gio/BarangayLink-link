"use client";

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard">
        <DashboardOverview />
      </DashboardLayout>
    </AuthProvider>
  );
}