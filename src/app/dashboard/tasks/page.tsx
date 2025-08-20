"use client";

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TaskManagement } from '@/components/dashboard/modules/TaskManagement';

export default function TasksPage() {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard/tasks">
        <TaskManagement />
      </DashboardLayout>
    </AuthProvider>
  );
}
