import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | GrowthOS",
  description: "GrowthOS terms of service. Governed by Ontario, Canada law.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
