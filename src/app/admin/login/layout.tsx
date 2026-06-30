import React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/admin/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "تسجيل الدخول | AURA Admin",
  description: "بوابة الدخول إلى نظام إدارة مؤسسة أورا",
  robots: "noindex, nofollow",
};

// ThemeProvider is mounted in this server layout (not inside the client screen) so
// next-themes' no-flash inline script is emitted in the server HTML — same pattern
// as the dashboard layout — preventing a light/dark flash on first paint.
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
