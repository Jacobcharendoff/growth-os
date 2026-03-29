import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GrowthOS vs Housecall Pro | Comparison for Canadian Contractors",
  description: "Compare GrowthOS and Housecall Pro side by side. No hidden add-on costs, built-in Canadian tax compliance, and bilingual support.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
