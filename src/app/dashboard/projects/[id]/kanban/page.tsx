"use client";

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProjectKanbanBoard } from '@/components/dashboard/views/ProjectKanbanBoard';

export default function ProjectKanbanPage({ params }: { params: { id: string } }) {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard/projects">
        <ProjectKanbanBoard projectId={params.id} />
      </DashboardLayout>
    </AuthProvider>
  );
}
