import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";


import NavBar from "./components/navbar";

import { SessionProviderWrapper } from "./components/session-provider-wrapper";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FMSBD",
  description: "Flood Management System Bangladesh",
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
        <SessionProviderWrapper>
        <NavBar />
        {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
