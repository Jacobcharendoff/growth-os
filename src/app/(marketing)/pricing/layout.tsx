import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | GrowthOS - Transparent, Simple Plans",
  description: "Choose your plan. Start free for 14 days. No credit card required. Starter ($79/mo), Growth ($149/mo), or Scale ($299/mo) — everything you need to grow.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
