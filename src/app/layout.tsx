import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { TestAuthProvider } from "@/context/TestAuthContext";
import { AuthProvider } from "@/context/AuthContext";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BarangayLink - Barangay Bitano Management System",
  description: "Digital platform for Barangay Bitano community services and transparent governance. Access government services, connect with your community, and stay informed.",
  keywords: ["barangay", "government", "services", "community", "Bitano", "Camalig", "Albay", "Philippines"],
  authors: [{ name: "Barangay Bitano" }],
  creator: "Barangay Bitano",
  publisher: "Barangay Bitano",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://barangaybitano.gov.ph"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BarangayLink - Barangay Bitano Management System",
    description: "Digital platform for Barangay Bitano community services and transparent governance",
    url: "https://barangaybitano.gov.ph",
    siteName: "BarangayLink",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BarangayLink - Barangay Bitano",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BarangayLink - Barangay Bitano Management System",
    description: "Digital platform for Barangay Bitano community services and transparent governance",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BarangayLink",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#16a34a" },
    { media: "(prefers-color-scheme: dark)", color: "#15803d" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BarangayLink" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans bg-gray-900 text-gray-100`}
      >
        <ClerkProvider>
          <PostHogProvider>
            <TestAuthProvider>
              <AuthProvider>
                <NotificationProvider>
                  {children}
                  <PWAInstallPrompt />
                  <Toaster />
                </NotificationProvider>
              </AuthProvider>
            </TestAuthProvider>
          </PostHogProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
