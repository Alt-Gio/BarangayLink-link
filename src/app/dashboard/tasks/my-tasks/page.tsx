"use client";

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MyTasks } from '@/components/dashboard/modules/MyTasks';

export default function MyTasksPage() {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard/tasks/my-tasks">
        <MyTasks />
      </DashboardLayout>
    </AuthProvider>
  );
}
