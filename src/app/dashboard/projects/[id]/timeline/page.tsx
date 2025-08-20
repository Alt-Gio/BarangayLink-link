"use client";

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProjectTimeline } from '@/components/dashboard/views/ProjectTimeline';

export default function ProjectTimelinePage({ params }: { params: { id: string } }) {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard/projects">
        <ProjectTimeline projectId={params.id} />
      </DashboardLayout>
    </AuthProvider>
  );
}
