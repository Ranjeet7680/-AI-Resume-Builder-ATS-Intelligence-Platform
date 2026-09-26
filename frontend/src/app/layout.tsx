import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import AiCareerAssistant from "@/components/ai/AiCareerAssistant";

export const metadata: Metadata = {
  title: "AI Resume Builder & ATS Intelligence",
  description: "Next-generation AI resume builder with LinkedIn authentication, XYZ achievement enhancer, and ATS score optimization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <AiCareerAssistant />
      </body>
    </html>
  );
}
