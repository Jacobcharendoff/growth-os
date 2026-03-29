import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Electrical Contractor CRM | Permits, Licenses & Invoicing | GrowthOS",
  description: "CRM for Canadian electricians. Track permits, manage estimates, chase fewer invoices. Built for solo operators and growing shops.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
