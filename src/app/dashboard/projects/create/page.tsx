"use client";

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProjectCreationForm } from '@/components/dashboard/forms/ProjectCreationForm';

export default function CreateProjectPage() {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard/projects/create">
        <ProjectCreationForm />
      </DashboardLayout>
    </AuthProvider>
  );
}
