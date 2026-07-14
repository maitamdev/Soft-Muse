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

import { generatePageMetadata } from "@/utils/seo-helper";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await generatePageMetadata(
    "homepage",
    "Soft Muse | Thời trang công sở nữ thanh lịch",
    "Soft Muse là thương hiệu thời trang công sở nữ hiện đại với áo sơ mi, áo kiểu, chân váy, váy, quần tây, blazer, set đồ và phụ kiện trong mức giá hợp lý."
  );

  return {
    ...meta,
    metadataBase: new URL("https://softmuse.vn"),
    authors: [{ name: "Soft Muse" }],
    icons: {
      icon: "/logo.svg",
      apple: "/logo.svg",
    },
  };
}

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      dir="ltr"
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
                name: "Soft Muse",
                url: "https://softmuse.vn",
                logo: "https://softmuse.vn/logo.svg",
                sameAs: [
                  "https://www.instagram.com/softmuse.vn",
                  "https://www.facebook.com/softmuse.vn",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "ClothingStore",
                name: "Soft Muse",
                image: "https://softmuse.vn/images/campaign/campaign_4.png",
                "@id": "https://softmuse.vn/#store",
                url: "https://softmuse.vn",
                telephone: "+84900000000",
                priceRange: "200000-1000000 VND",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "",
                  addressLocality: "TP. Hồ Chí Minh",
                  addressRegion: "TP. Hồ Chí Minh",
                  postalCode: "700000",
                  addressCountry: "VN",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 10.7769,
                  longitude: 106.7009,
                },
                openingHoursSpecification: {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Saturday",
                    "Sunday",
                  ],
                  opens: "10:00",
                  closes: "22:00",
                },
              },
            ]),
          }}
        />
        <NotificationProvider>
          <StoreProvider>
            <ScrollProgressClient />
            <StorefrontLayoutWrapper>{children}</StorefrontLayoutWrapper>
          </StoreProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
