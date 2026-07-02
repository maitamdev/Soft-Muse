import React from 'react';
import { AdminLayoutWrapper } from '@/components/admin/layout/AdminLayoutWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AURA Admin Dashboard',
  description: 'Admin Dashboard for AURA Luxury',
  robots: 'noindex, nofollow',
};

// ThemeProvider (next-themes) is mounted once in the shared parent layout
// (src/app/admin/layout.tsx) so it stays mounted across client-side
// navigation between /admin/login and this segment. See that file for why.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutWrapper>
      {children}
    </AdminLayoutWrapper>
  );
}
