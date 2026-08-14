import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UserPortal — Enterprise User Management",
  description: "Securely manage your user account and profile information.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
