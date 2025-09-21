import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Header } from "@/components/Header";
import { MusicPlayer } from "@/components/MusicPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KabuTune - Modern Music Streaming",
  description: "Discover and stream music from YouTube with a beautiful, modern interface. Search, explore, and enjoy your favorite tracks with professional-grade audio streaming.",
  keywords: ["music", "streaming", "youtube", "audio", "playlist", "favorites"],
  authors: [{ name: "KabuTune Team" }],
  creator: "KabuTune",
  publisher: "KabuTune",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kabutune.app'),
  openGraph: {
    title: "KabuTune - Modern Music Streaming",
    description: "Discover and stream music from YouTube with a beautiful, modern interface.",
    url: 'https://kabutune.app',
    siteName: 'KabuTune',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KabuTune - Modern Music Streaming',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "KabuTune - Modern Music Streaming",
    description: "Discover and stream music from YouTube with a beautiful, modern interface.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground selection:bg-primary/20 selection:text-primary-foreground`}
      >
        <ThemeProvider>
          <MusicPlayerProvider>
            <FavoritesProvider>
              <div className="min-h-screen flex flex-col relative">
                {/* Background Pattern */}
                <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-background to-primary-50/30 dark:to-primary-950/20" />
                <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
                
                {/* Header */}
                <Header />
                
                {/* Main Content */}
                <main className="flex-1 relative z-10">
                  {children}
                </main>
                
                {/* Music Player */}
                <MusicPlayer />
                
                {/* Loading Overlay */}
                <div id="loading-overlay" className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg-xl">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">Loading...</span>
                  </div>
                </div>
              </div>
            </FavoritesProvider>
          </MusicPlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
