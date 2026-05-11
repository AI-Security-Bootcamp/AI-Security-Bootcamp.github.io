import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { PHProvider } from "./providers";

export const metadata: Metadata = {
  title: "AI Security Bootcamp",
  description: "A 7-day intensive program for security professionals shaping how we secure emerging AI systems.",
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-KG8SNYGJLT" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KG8SNYGJLT');
          `}
        </Script>
      </head>
      <PHProvider>
        <body className="antialiased">
          {children}
        </body>
      </PHProvider>
    </html>
  );
}
