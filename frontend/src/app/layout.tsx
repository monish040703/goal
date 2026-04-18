import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoalFlow — AI-Powered Goal & Business Tracker",
  description: "Track your daily goals, manage business ambitions, and get AI-powered weekly summaries to supercharge your productivity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
