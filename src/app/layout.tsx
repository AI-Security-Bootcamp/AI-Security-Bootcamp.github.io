import type { Metadata } from "next";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply the theme before the first paint, without waiting for hydration. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              let theme;
              try {
                theme = localStorage.getItem("theme");
              } catch {}
              const isDark = theme === "dark" ||
                (theme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
              document.documentElement.classList.toggle("dark", isDark);
            })();`,
          }}
        />
      </head>
      <PHProvider>
        <body className="antialiased">
          {children}
        </body>
      </PHProvider>
    </html>
  );
}
