import type { Metadata } from "next";
import { Manrope, Inter, DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { config } from "@/lib/config";
import Navbar from "@/components/shared/layout/Navbar";
import Footer from "@/components/shared/layout/Footer";
import ContentWrapper from "@/components/shared/layout/ContentWrapper";
import RightSidebar from "@/components/shared/layout/RightSidebar";
import { CartProvider } from "@/contexts/CartContext";
import { ProjectProvider } from "@/contexts/ProjectContext";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Furnishes",
    template: "%s | Furnishes",
  },
  description:
    "Design rooms that actually fit—furniture, layout, and validation in one flow.",
  applicationName: "Furnishes",
  metadataBase: new URL(config.siteUrl),
  openGraph: {
    title: "Furnishes",
    description:
      "Design rooms that actually fit—furniture, layout, and validation in one flow.",
    url: config.siteUrl,
    siteName: "Furnishes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Furnishes",
    description:
      "Design rooms that actually fit—furniture, layout, and validation in one flow.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${dmSans.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        <Navbar />
        <CartProvider>
          <ProjectProvider>
            <ContentWrapper sidebar={<RightSidebar />}>
              {children}
            </ContentWrapper>
          </ProjectProvider>
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
