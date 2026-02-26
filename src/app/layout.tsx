import type { Metadata } from "next";
import "./globals.css";
import { PHProvider } from "./providers";

export const metadata: Metadata = {
  title: "AI Security Bootcamp",
  description: "A 7-day intensive program for security professionals shaping how we secure emerging AI systems.",
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
      <PHProvider>
        <body className="antialiased">
          {children}
        </body>
      </PHProvider>
    </html>
  );
}
