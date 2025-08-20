"use client";

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DocumentSystem } from '@/components/dashboard/modules/DocumentSystem';

export default function DocumentsPage() {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard/documents">
        <DocumentSystem />
      </DashboardLayout>
    </AuthProvider>
  );
}
