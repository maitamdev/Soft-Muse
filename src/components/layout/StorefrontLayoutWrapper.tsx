"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "@/components/layout/Navbar";
import dynamic from "next/dynamic";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ScrollToTop from "@/components/ui/ScrollToTopClient";
import CustomerNotificationListener from "@/components/storefront/CustomerNotificationListener";
const Footer = dynamic(() => import("@/components/layout/Footer"), { ssr: true });

export function StorefrontLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
      <CustomerNotificationListener />
    </>
  );
}
