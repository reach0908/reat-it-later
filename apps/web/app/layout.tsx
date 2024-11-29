import type { Metadata } from "next";

import "@repo/ui/styles/globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
        {/* rest of your scripts go under */}
      </head>
      <body>{children}</body>
    </html>
  );
}
