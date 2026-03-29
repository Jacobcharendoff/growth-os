import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why GrowthOS | The CRM Built for Canadian Service Businesses",
  description: "Discover why 500+ Canadian service businesses choose GrowthOS. Bilingual by default, Canadian tax automated, 1/3 the cost. See the difference. 14-day free trial.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
