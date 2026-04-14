import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import SvgFilters from "@/components/SvgFilters";
import CustomCursor from "@/components/CustomCursor";
import LenisProvider from "@/components/LenisProvider";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Literia | Membaca Ulang Dunia",
  description:
    "Literia bukan sekadar tempat menemukan bacaan. Kami adalah ruang kontemplasi digital, mengkurasi literatur yang mendefinisikan ulang cara kita melihat realitas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${manrope.variable} antialiased`}
      style={
        {
          "--font-serif": "var(--font-cormorant), serif",
          "--font-sans": "var(--font-manrope), sans-serif",
        } as React.CSSProperties
      }
    >
      <body>
        <SvgFilters />
        <LenisProvider>
          <CustomCursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
