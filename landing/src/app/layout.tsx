import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-signifier",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sohne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yellow.ai Nexus Loop | Editorial Analytics",
  description: "Evaluate, verify, and decide with the human-in-the-loop Operator Desk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${inter.variable} font-sohne bg-paper-white text-ink-black selection:bg-blush-peach selection:text-sienna-brown`}>
        {children}
      </body>
    </html>
  );
}
