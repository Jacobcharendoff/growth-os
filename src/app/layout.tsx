import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "Staybookt - The Operating System for Service Business Growth",
  description: "The all-in-one CRM and pipeline management platform built for service businesses. Manage leads, automate follow-ups, and grow revenue.",
  keywords: "CRM, field service software, plumbing software, HVAC software, electrical software, contractor management, pipeline management, Canadian CRM",
  robots: "index, follow",
  manifest: "/manifest.json",
  themeColor: "#27AE60",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Staybookt",
  },
  openGraph: {
    title: "Staybookt — The CRM Built for Canadian Service Businesses",
    description: "Bilingual CRM with pipeline management, automations, and Canadian tax compliance. Built for plumbers, HVAC techs, electricians, and more.",
    type: "website",
    url: "https://staybookt-pied.vercel.app",
    images: [
      {
        url: "https://staybookt-pied.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Staybookt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://staybookt-pied.vercel.app",
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
    name: "Staybookt",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "Bilingual CRM built for Canadian home service businesses. Pipeline management, automations, invoicing with provincial tax compliance.",
    url: "https://staybookt-pied.vercel.app",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CAD",
      lowPrice: "79",
      highPrice: "299",
      offerCount: "3",
    },
    creator: {
      "@type": "Organization",
      name: "Staybookt",
      url: "https://staybookt-pied.vercel.app",
      address: {
        "@type": "PostalAddress",
        addressCountry: "CA",
      },
    },
  };

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#27AE60" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <ServiceWorkerRegistration />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
