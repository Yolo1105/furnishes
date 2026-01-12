import type { Metadata } from "next";
import { Manrope, Inter, DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/layout/Navbar";
import RightSidebar from "@/components/shared/layout/RightSidebar";
import Footer from "@/components/shared/layout/Footer";
import ContentWrapper from "@/components/shared/layout/ContentWrapper";
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
  title: "Furnishes",
  description: "A modern Next.js application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${dmSans.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <ProjectProvider>
            <Navbar />
            <ContentWrapper sidebar={<RightSidebar />}>
              {children}
              <Footer />
            </ContentWrapper>
          </ProjectProvider>
        </CartProvider>
      </body>
    </html>
  );
}
