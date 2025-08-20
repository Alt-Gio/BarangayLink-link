"use client";

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProjectManagement } from '@/components/dashboard/modules/ProjectManagement';

export default function ProjectsPage() {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard/projects">
        <ProjectManagement />
      </DashboardLayout>
    </AuthProvider>
  );
}
