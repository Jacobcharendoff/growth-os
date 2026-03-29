import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";

export const metadata: Metadata = {
  title: "GrowthOS - The Operating System for Service Business Growth",
  description: "The all-in-one CRM and pipeline management platform built for service businesses. Manage leads, automate follow-ups, and grow revenue.",
  keywords: "CRM, field service software, plumbing software, HVAC software, electrical software, contractor management, pipeline management, Canadian CRM",
  robots: "index, follow",
  openGraph: {
    title: "GrowthOS — The CRM Built for Canadian Service Businesses",
    description: "Bilingual CRM with pipeline management, automations, and Canadian tax compliance. Built for plumbers, HVAC techs, electricians, and more.",
    type: "website",
    url: "https://growth-os-three-pied.vercel.app",
    images: [
      {
        url: "https://growth-os-three-pied.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "GrowthOS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://growth-os-three-pied.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GrowthOS",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "Bilingual CRM built for Canadian home service businesses. Pipeline management, automations, invoicing with provincial tax compliance.",
    url: "https://growth-os-three-pied.vercel.app",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CAD",
      lowPrice: "79",
      highPrice: "299",
      offerCount: "3",
    },
    creator: {
      "@type": "Organization",
      name: "GrowthOS",
      url: "https://growth-os-three-pied.vercel.app",
      address: {
        "@type": "PostalAddress",
        addressCountry: "CA",
      },
    },
  };

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <Script
          id="jsonld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
