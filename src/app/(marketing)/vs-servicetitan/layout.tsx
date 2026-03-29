import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GrowthOS vs ServiceTitan | Comparison for Canadian Contractors",
  description: "Compare GrowthOS and ServiceTitan side by side. See why Canadian service businesses are switching from ServiceTitan's enterprise pricing to GrowthOS.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
