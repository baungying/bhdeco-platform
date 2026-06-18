import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "BH DECO AI — AI Interior Design Platform",
  description: "Transform interior photos into beautiful AI designs. Generate interiors, create furniture plans, and produce construction blueprints with BH DECO AI.",
  keywords: "AI Interior Design, Room Design AI, Furniture AI, Blueprint AI, BH DECO AI",
  openGraph: { title: "BH DECO AI — AI Interior Design Platform", description: "Transform interior photos into beautiful AI designs.", type: "website", url: "https://bhdeco.ai" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
