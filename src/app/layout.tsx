import type { Metadata } from "next";
import { Inter, Alexandria, El_Messiri, Playfair_Display } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { StorefrontLayoutWrapper } from "@/components/layout/StorefrontLayoutWrapper";
import ScrollProgressClient from "@/components/ui/ScrollProgressClient";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const elMessiri = El_Messiri({
  variable: "--font-el-messiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aura-brand-virid.vercel.app"),
  title: "AURA | دار الأزياء المصرية الراقية",
  description: "أورا - دار أزياء نسائية مصرية فاخرة تقدم مفهومًا متطورًا للأناقة والأنوثة العصرية بأيدي حرفية متقنة وتفاصيل فريدة.",
  keywords: ["AURA", "أورا", "أزياء نسائية", "كوتور", "ملابس فاخرة", "أزياء مصرية"],
  authors: [{ name: "AURA Fashion House" }],
  openGraph: {
    title: "AURA | دار الأزياء المصرية الراقية",
    description: "تجسيد الفخامة والأناقة الهادئة بتصاميم عصرية.",
    url: "/",
    siteName: "AURA",
    images: [
      {
        url: "/aura_thumbnail.png",
        width: 1200,
        height: 630,
        alt: "AURA Luxury Campaign",
      },
    ],
    locale: "ar_EG",
    type: "website",
    countryName: "Egypt",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA | دار الأزياء المصرية الراقية",
    description: "تجسيد الفخامة والأناقة الهادئة بتصاميم عصرية.",
    images: ["/aura_thumbnail.png"],
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${inter.variable} ${alexandria.variable} ${elMessiri.variable} ${playfairDisplay.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col bg-background-primary text-text-primary selection:bg-accent selection:text-background-secondary overflow-x-hidden w-full">
        {/* Structured Data: JSON-LD for Organization & LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "AURA",
                "url": "https://aura-fashion-virid.vercel.app",
                "logo": "https://aura-fashion-virid.vercel.app/logo.svg",
                "sameAs": [
                  "https://www.instagram.com/aura.eg",
                  "https://www.facebook.com/aura.eg"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "AURA Atelier",
                "image": "https://aura-fashion-virid.vercel.app/aura_hero_campaign.png",
                "@id": "https://aura-fashion-virid.vercel.app/#localbusiness",
                "url": "https://aura-fashion-virid.vercel.app",
                "telephone": "+201000000000",
                "priceRange": "$$$",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "المهندسين",
                  "addressLocality": "الجيزة",
                  "addressRegion": "الجيزة",
                  "postalCode": "12611",
                  "addressCountry": "EG"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 30.0596,
                  "longitude": 31.2018
                },
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Saturday",
                    "Sunday"
                  ],
                  "opens": "10:00",
                  "closes": "22:00"
                }
              }
            ])
          }}
        />
        <NotificationProvider>
          <StoreProvider>
            <ScrollProgressClient />
            <StorefrontLayoutWrapper>
              {children}
            </StorefrontLayoutWrapper>
          </StoreProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
