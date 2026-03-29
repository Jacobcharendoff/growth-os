import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | GrowthOS",
  description: "How GrowthOS collects, uses, and protects your data. PIPEDA compliant. Canadian data privacy.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
