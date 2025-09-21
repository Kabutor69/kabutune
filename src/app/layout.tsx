import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Header } from "@/components/Header";
import { MusicPlayer } from "@/components/MusicPlayer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KabuTune - Simple Music Streaming",
  description: "Discover and stream music from YouTube with a clean, minimal interface. Search, explore, and enjoy your favorite tracks with simplicity.",
  keywords: ["music", "streaming", "youtube", "audio", "playlist", "favorites", "minimal", "clean"],
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
    title: "KabuTune - Simple Music Streaming",
    description: "Discover and stream music from YouTube with a clean, minimal interface.",
    url: 'https://kabutune.app',
    siteName: 'KabuTune',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KabuTune - Simple Music Streaming',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "KabuTune - Simple Music Streaming",
    description: "Discover and stream music from YouTube with a clean, minimal interface.",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#06b6d4" />
        <meta name="color-scheme" content="dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary>
          <MusicPlayerProvider>
            <FavoritesProvider>
              <div className="min-h-screen bg-black text-cyan-300">
                {/* Header */}
                <Header />
                
                {/* Main Content */}
                <main className="pb-32">
                  {children}
                </main>
                
                {/* Music Player */}
                <MusicPlayer />
              </div>
            </FavoritesProvider>
          </MusicPlayerProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
