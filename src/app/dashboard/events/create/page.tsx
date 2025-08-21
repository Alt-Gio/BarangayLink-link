"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CreateEventForm } from '@/components/dashboard/forms/CreateEventForm';

export default function CreateEventPage() {
  return (
    <AuthProvider>
      <DashboardLayout currentPage="/dashboard/events">
        <CreateEventForm />
      </DashboardLayout>
    </AuthProvider>
  );
}
