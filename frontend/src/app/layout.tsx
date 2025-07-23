import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClickBeard",
  description: "Site de agendamento de barbearia",
  icons: [
    { rel: "icon", url: "/icon/favicon/favicon.ico" },
    { rel: "icon", type: "image/png", sizes: "16x16", url: "/icon/favicon/favicon-16x16.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/icon/favicon/favicon-32x32.png" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/icon/favicon/apple-touch-icon.png" },
    { rel: "icon", type: "image/png", sizes: "192x192", url: "/icon/favicon/android-chrome-192x192.png" },
    { rel: "icon", type: "image/png", sizes: "512x512", url: "/icon/favicon/android-chrome-512x512.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
