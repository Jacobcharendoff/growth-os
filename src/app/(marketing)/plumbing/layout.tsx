import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plumbing CRM Software | Manage Leads & Invoices | GrowthOS",
  description: "CRM built for Canadian plumbers. Auto-respond to missed calls, send estimates from your phone, get paid faster. 14-day free trial.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
