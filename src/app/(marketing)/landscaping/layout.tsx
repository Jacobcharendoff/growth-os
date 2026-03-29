import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Landscaping CRM Software | Crew Scheduling & Estimates | GrowthOS",
  description: "CRM for Canadian landscaping businesses. Manage seasonal crews, automate estimate follow-ups, handle recurring contracts.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
