import React from 'react';
import { AdminLayoutWrapper } from '@/components/admin/layout/AdminLayoutWrapper';
import { ThemeProvider } from '@/components/admin/providers/ThemeProvider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AURA Admin Dashboard',
  description: 'Admin Dashboard for AURA Luxury',
  robots: 'noindex, nofollow',
};

// ThemeProvider (next-themes) is mounted here in the server-rendered layout —
// not inside the client AdminLayoutWrapper — so its no-flash inline <script> is
// emitted once in the server HTML and is never re-rendered as part of a client
// component subtree (which triggers React 19's "script tag" warning).
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminLayoutWrapper>
        {children}
      </AdminLayoutWrapper>
    </ThemeProvider>
  );
}
