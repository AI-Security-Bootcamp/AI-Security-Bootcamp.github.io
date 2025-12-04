import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Security Bootcamp",
  description: "4-week intensive program to bring researchers and engineers up to speed on security fundamentals for AI systems",
  icons: {
    icon: '/robot.png',
    apple: '/robot.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
