import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact GrowthOS | Book a Demo or Get in Touch",
  description: "Questions about GrowthOS? Book a free demo or send us a message. We're based in Toronto and love talking to service business owners.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
