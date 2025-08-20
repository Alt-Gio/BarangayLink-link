"use client";

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ReportsAnalytics } from '@/components/dashboard/modules/ReportsAnalytics';

export default function ReportsPage() {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard/reports">
        <ReportsAnalytics />
      </DashboardLayout>
    </AuthProvider>
  );
}
