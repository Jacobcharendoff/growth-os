import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roofing Contractor CRM | Estimates to Invoices Faster | GrowthOS",
  description: "CRM for Canadian roofing contractors. Track big-ticket estimates, manage crews, get paid faster. 14-day free trial.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
