import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GrowthOS vs Jobber | Comparison for Canadian Service Businesses",
  description: "Compare GrowthOS and Jobber side by side. See why Canadian contractors choose GrowthOS for bilingual support, Canadian tax compliance, and growth automation.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
