import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/context/auth-context";
import { LanguageProvider } from "@/context/language-context";
import { ThemeProvider } from "@/context/theme-context";
import { ThemeScript } from "@/components/theme-script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "EcoDrop - Smart E-Waste Bin",
  description: "Find bins, recycle e-waste, and earn rewards.",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <meta name="theme-color" content="#22c55e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground scroll-smooth`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              {/* Desktop Background Container */}
              <div className="fixed inset-0 -z-10 hidden md:block bg-linear-to-br from-zinc-100 to-zinc-100 dark:from-zinc-950 dark:to-zinc-950" />
              
              {/* Main Responsive Layout Container */}
              <div className="min-h-screen flex flex-col items-center justify-start md:justify-center md:py-6 lg:py-8 xl:py-10">
                {/* App Container with Responsive Sizing */}
                <div className="flex flex-col relative w-full h-dvh md:h-auto md:max-h-[90vh] md:rounded-3xl lg:rounded-4xl md:shadow-xl lg:shadow-2xl md:border md:border-border bg-background overflow-hidden ring-1 ring-zinc-900/5 dark:ring-white/10 transition-all duration-300">
                  
                  {/* Header */}
                  <Header />
                  
                  {/* Main Content Area */}
                  <main className="flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-hide">
                    {/* Content Wrapper with Responsive Padding */}
                    <div className="flex flex-col relative w-full h-full">
                      {/* Adaptive Content Padding and Layout */}
                      <div className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 pb-24 sm:pb-20 md:pb-8 lg:pb-10">
                        {children}
                      </div>
                    </div>
                  </main>
                  
                  {/* Bottom Navigation */}
                  <nav className="sticky bottom-0 z-50 w-full" role="navigation">
                    <BottomNav />
                  </nav>
                </div>
              </div>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
