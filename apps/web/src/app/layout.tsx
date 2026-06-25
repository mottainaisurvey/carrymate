import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarryMate — Diaspora Logistics Marketplace",
  description: "Send parcels home with trusted travelers. Peer-to-peer delivery for the diaspora.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
