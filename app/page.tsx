"use client";

// app/page.tsx — Literia Landing Page
// Assembles all section components and wires up shared state:
// - activeBook: which book is open in the detail overlay
// - lenis: stop/start smooth scroll when overlay is open

import { useState, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import ArchiveSection, { type BookData } from "@/components/ArchiveSection";
import LibreriaSection, { type CatalogBook } from "@/components/LibreriaSection";
import AuthorSection from "@/components/AuthorSection";
import Footer from "@/components/Footer";
import BookDetailOverlay, {
  type ActiveBook,
} from "@/components/BookDetailOverlay";
import { useLenis } from "@/components/LenisProvider";

export default function Home() {
  const [activeBook, setActiveBook] = useState<ActiveBook | null>(null);
  const { lenis } = useLenis();

  const handleBookClick = useCallback(
    (data: BookData | CatalogBook, imgEl: HTMLImageElement) => {
      setActiveBook({ data, originalImg: imgEl });
    },
    []
  );

  const handleClose = useCallback(() => {
    setActiveBook(null);
  }, []);

  const handleLenisStop = useCallback(() => {
    lenis?.stop();
  }, [lenis]);

  const handleLenisStart = useCallback(() => {
    lenis?.start();
  }, [lenis]);

  return (
    <>
      {/* Book detail overlay — always rendered, visually hidden via clip-path */}
      <BookDetailOverlay
        activeBook={activeBook}
        onClose={handleClose}
        onLenisStop={handleLenisStop}
        onLenisStart={handleLenisStart}
      />

      {/* Main scrollable wrapper — sits above the pinned footer */}
      <div className="main-wrapper" id="smooth-wrapper">
        <div id="smooth-content">
          <HeroSection />
          <ArchiveSection onBookClick={handleBookClick} />
          <LibreriaSection onBookClick={handleBookClick} />
          <AuthorSection />
        </div>
      </div>

      {/* Footer reveal — fixed behind main-wrapper */}
      <Footer />
    </>
  );
}
