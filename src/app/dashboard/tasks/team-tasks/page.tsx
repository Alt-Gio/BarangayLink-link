"use client";

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TeamTasks } from '@/components/dashboard/modules/TeamTasks';

export default function TeamTasksPage() {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard/tasks/team-tasks">
        <TeamTasks />
      </DashboardLayout>
    </AuthProvider>
  );
}
