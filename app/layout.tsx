import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/language-context";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FC City Boys Zurich ",
  description: "Official website of FC City Boys Zurich - Professional football club dedicated to excellence, passion, and community spirit. Join us on our journey to greatness.",
  keywords: ["football club", "FC City Boys", "Zurich football", "professional football", "football academy", "Swiss football"],
  authors: [{ name: "FC City Boys" }],
  icons: {
    icon: [
      { url: "/images/logo.png", type: "image/png", sizes: "any" },
      { url: "/images/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/images/logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: { url: "/images/logo.png", type: "image/png" },
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/images/logo.png",
      },
    ],
  },
  openGraph: {
    title: "FC City Boys Zurich - Professional Football Club",
    description: "Professional football club dedicated to excellence, passion, and community spirit",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "FC City Boys Zurich Logo",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0054A8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
