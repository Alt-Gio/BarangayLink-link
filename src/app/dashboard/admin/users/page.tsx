"use client";

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { UserManagement } from '@/components/dashboard/modules/UserManagement';

export default function UsersPage() {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard/admin/users">
        <UserManagement />
      </DashboardLayout>
    </AuthProvider>
  );
}
