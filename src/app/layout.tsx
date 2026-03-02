import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "guardAIn – NSW Tenant Support",
  description: "AI-powered assistant for NSW tenancy law information and support. Get help with lease reviews, repair requests, rent increases, and bond disputes.",
  keywords: ["NSW", "tenancy", "tenant rights", "rent", "lease", "legal support", "AI assistant", "Australia"],
  authors: [{ name: "guardAIn Team" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%231a5cff' rx='15' width='100' height='100'/><text x='50' y='65' font-size='45' font-weight='bold' text-anchor='middle' fill='white'>gA</text></svg>",
  },
  openGraph: {
    title: "guardAIn – NSW Tenant Support",
    description: "AI-powered assistant for NSW tenancy law information and support",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable} antialiased`}
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
