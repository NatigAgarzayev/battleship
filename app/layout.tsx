import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/providers/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-be-vietnam-pro',
})

export const metadata: Metadata = {
  title: {
    default: "Battleship - Multiplayer Naval Warfare Game",
    template: "%s | Battleship"
  },
  description: "Play the classic Battleship game online! Challenge friends or battle against AI in this strategic naval warfare game. Free multiplayer gameplay with real-time battles.",
  keywords: ["battleship", "battleship game", "multiplayer game", "naval warfare", "online game", "strategy game", "board game", "free game"],
  authors: [{ name: "Natig Agharzayev", url: "https://github.com/NatigAgarzayev" }],
  creator: "Natig Agharzayev",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://battleship-natig.vercel.app",
    siteName: "Battleship Game",
    title: "Battleship - Multiplayer Naval Warfare Game",
    description: "Play the classic Battleship game online! Challenge friends or battle against AI in real-time.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Battleship - Multiplayer Naval Warfare Game",
    description: "Play the classic Battleship game online! Challenge friends or battle against AI.",
    images: ["/og-image.png"]
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.png",
    apple: "/favicon.png"
  },
  manifest: "/site.webmanifest"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${beVietnamPro.variable} antialiased`}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
