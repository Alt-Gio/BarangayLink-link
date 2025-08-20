"use client";

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProductivityDashboard } from '@/components/dashboard/modules/ProductivityDashboard';

export default function ProductivityPage() {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard/productivity">
        <ProductivityDashboard />
      </DashboardLayout>
    </AuthProvider>
  );
}
