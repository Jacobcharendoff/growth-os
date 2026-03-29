import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HVAC CRM Software | Book More Jobs, Less Chaos | GrowthOS",
  description: "CRM for HVAC contractors in Canada. Handle seasonal demand, automate estimate follow-ups, track maintenance contracts. Bilingual support.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
