import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interviewer Agent",
  description: "An AI-powered interviewer agent for practice interviews.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
