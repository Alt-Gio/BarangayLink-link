"use client";

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { FinancialSystem } from '@/components/dashboard/modules/FinancialSystem';

export default function FinancialPage() {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard/financial">
        <FinancialSystem />
      </DashboardLayout>
    </AuthProvider>
  );
}
