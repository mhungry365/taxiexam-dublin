import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site";
import { AppFooter, TopNav } from "@/components/taxiexam/top-nav";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "TaxiExam Dublin | SPSV Taxi Driver Test Prep",
    template: "%s | TaxiExam Dublin"
  },
  description:
    "Four-week Dublin SPSV taxi driver entry test preparation with smart quizzes, spaced repetition, weak-question review, and mock exams.",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  },
  openGraph: {
    title: "TaxiExam Dublin",
    description: "Pass-ready SPSV and Dublin Area Knowledge practice in four weeks.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "TaxiExam Dublin",
    description: "Pass-ready SPSV and Dublin Area Knowledge practice in four weeks."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IE" className={sans.variable}>
      <body>
        <TopNav />
        <main>{children}</main>
        <AppFooter />
      </body>
    </html>
  );
}
