import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
 title: "Đăng nhập | AURA Admin",
 description: "đếnQuản lý AURA",
 robots: "noindex, nofollow",
};

// ThemeProvider is mounted once in the shared parent layout
// (src/app/admin/layout.tsx) so it stays mounted across client-side
// navigation between this segment and /admin/(dashboard). See that file for why.
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
 return <>{children}</>;
}
