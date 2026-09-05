import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavVisibilityProvider } from "@/lib/nav-context";
import { NavBar } from "@/components/ui/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grindstone — DSA, without the grind.",
  description:
    "Grindstone turns every DSA session into a guided interview, coding round, and automatic review.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <NavVisibilityProvider>
          <NavBar />
          <div className="flex-1">{children}</div>
        </NavVisibilityProvider>
      </body>
    </html>
  );
}
