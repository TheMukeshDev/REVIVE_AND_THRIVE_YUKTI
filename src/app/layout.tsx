import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "EcoDrop - Smart E-Waste Bin",
  description: "Find bins, recycle e-waste, and earn rewards.",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <div className="min-h-screen flex justify-center md:bg-zinc-100 dark:md:bg-zinc-950 md:items-center md:py-8">
                <div className="flex flex-col relative w-full h-dvh md:h-auto md:w-full max-w-md md:max-w-none md:rounded-4xl md:shadow-2xl md:border bg-background overflow-hidden ring-1 ring-zinc-900/5 dark:ring-white/10">
                  <Header />
                  <main className="flex-1 w-full overflow-y-auto scrollbar-hide pb-28 md:pb-10 pt-4 px-3 sm:px-4 md:px-6">
                    {children}
                  </main>
                  <div className="z-50">
                    <BottomNav />
                  </div>
                </div>
              </div>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
