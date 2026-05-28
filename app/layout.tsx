import { Suspense } from "react";
import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/main-nav";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex"
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono"
});

export const metadata: Metadata = {
  title: "NJU AI 经验社区",
  description: "面向南京大学学生的 AI 使用经验分享平台。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${ibmPlexSans.variable} ${jetBrainsMono.variable} app-shell`}>
        <Suspense fallback={null}>
          <MainNav />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
