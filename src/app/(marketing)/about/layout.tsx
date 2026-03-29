import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About GrowthOS | Built by Operators, for Operators",
  description: "GrowthOS was built in Canada to give every service business the growth tools that used to be reserved for companies with big budgets.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
