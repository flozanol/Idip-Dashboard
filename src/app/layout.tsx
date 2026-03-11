import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IDIP Marketing Pulse",
  description: "Executive Dashboard for Beauty & Image Design School",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased bg-black text-white selection:bg-rose-500/30">
        {children}
      </body>
    </html>
  );
}
