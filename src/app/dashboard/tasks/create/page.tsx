"use client";

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CreateTaskForm } from '@/components/dashboard/forms/CreateTaskForm';

export default function CreateTaskPage() {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard/tasks/create">
        <CreateTaskForm />
      </DashboardLayout>
    </AuthProvider>
  );
}
