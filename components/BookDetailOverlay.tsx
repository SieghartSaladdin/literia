"use client";

// BookDetailOverlay.tsx
// Full-screen overlay that reveals a book's detail using GSAP Flip animation.
// The clicked book cover "flies" from its grid position into the detail panel.

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import type { BookData } from "./ArchiveSection";
import type { CatalogBook } from "./LibreriaSection";

gsap.registerPlugin(Flip);

export interface ActiveBook {
  data: BookData | CatalogBook;
  originalImg: HTMLImageElement;
}

interface BookDetailOverlayProps {
  activeBook: ActiveBook | null;
  onClose: () => void;
  onLenisStop: () => void;
  onLenisStart: () => void;
}

export default function BookDetailOverlay({
  activeBook,
  onClose,
  onLenisStop,
  onLenisStart,
}: BookDetailOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageTargetRef = useRef<HTMLDivElement>(null);
  const detailContentRef = useRef<HTMLDivElement>(null);
  const btnAddRef = useRef<HTMLButtonElement>(null);

  // Holds the clone while the overlay is open
  const cloneRef = useRef<HTMLImageElement | null>(null);

  // ── Open: triggered whenever activeBook changes (non-null) ──
  useEffect(() => {
    if (!activeBook) return;

    const overlay = overlayRef.current;
    const imageTarget = imageTargetRef.current;
    const detailContent = detailContentRef.current;
    if (!overlay || !imageTarget || !detailContent) return;

    onLenisStop();

    const { originalImg, data } = activeBook;
    const rect = originalImg.getBoundingClientRect();

    // Create clone
    const clone = originalImg.cloneNode(true) as HTMLImageElement;
    gsap.set(clone, { clearProps: "transform" });
    Object.assign(clone.style, {
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      zIndex: "60",
      margin: "0",
    });
    document.body.appendChild(clone);
    cloneRef.current = clone;

    // Hide original temporarily
    gsap.set(originalImg, { opacity: 0 });

    // Reset detail content
    gsap.set(detailContent, { opacity: 0, y: 40 });

    // Capture state before moving
    const state = Flip.getState(clone);

    // Open overlay
    overlay.classList.add("is-open");
    overlay.classList.remove("pointer-events-none");

    // Move clone into target & make it fill absolutely
    imageTarget.appendChild(clone);
    Object.assign(clone.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
    });

    // FLIP
    Flip.from(state, {
      duration: 1,
      ease: "power4.inOut",
      onComplete: () => {
        gsap.to(detailContent, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      },
    });
  }, [activeBook, onLenisStop]);

  // ── Close ──
  const handleClose = useCallback(() => {
    const overlay = overlayRef.current;
    const detailContent = detailContentRef.current;
    const clone = cloneRef.current;
    if (!overlay || !detailContent || !clone || !activeBook) return;

    // Hide text
    gsap.to(detailContent, {
      opacity: 0,
      y: 40,
      duration: 0.4,
      ease: "power2.in",
    });

    // Capture state from fullscreen position
    const state = Flip.getState(clone);

    // Move clone back to body
    document.body.appendChild(clone);

    const rect = activeBook.originalImg.getBoundingClientRect();
    Object.assign(clone.style, {
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });

    // Close overlay
    overlay.classList.remove("is-open");
    overlay.classList.add("pointer-events-none");

    // Reset add button
    if (btnAddRef.current) btnAddRef.current.classList.remove("added");

    // FLIP back
    Flip.from(state, {
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(activeBook.originalImg, { opacity: 1 });
        clone.remove();
        cloneRef.current = null;
        onLenisStart();
        onClose();
      },
    });
  }, [activeBook, onClose, onLenisStart]);

  const handleAddToCart = () => {
    if (btnAddRef.current && !btnAddRef.current.classList.contains("added")) {
      btnAddRef.current.classList.add("added");
    }
  };

  const price =
    activeBook && "price" in activeBook.data ? activeBook.data.price : "$24.00";

  return (
    <div
      id="detail-view"
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-paper flex flex-col md:flex-row pointer-events-none"
    >
      {/* Close button */}
      <button
        id="close-detail"
        onClick={handleClose}
        className="absolute top-8 right-8 z-50 w-12 h-12 flex items-center justify-center rounded-full border border-ink/20 hover:bg-ink hover:text-paper transition-colors duration-500 pointer-events-auto"
        data-cursor="Close"
        aria-label="Close detail"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {/* Left: Image container — clone lands here */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center bg-sand/30 relative">
        <div
          id="detail-image-target"
          ref={imageTargetRef}
          className="w-1/2 aspect-[2/3] relative detail-cover-container"
        />
      </div>

      {/* Right: Book detail content */}
      <div
        ref={detailContentRef}
        className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-24 flex flex-col justify-center pointer-events-auto opacity-0 translate-y-10 detail-content"
      >
        <p
          id="detail-author"
          className="font-sans text-sm tracking-widest uppercase text-graphite mb-4"
        >
          {activeBook?.data.author ?? "Penulis"}
        </p>
        <h2
          id="detail-title"
          className="font-serif text-5xl md:text-7xl mb-8 leading-none"
        >
          {activeBook?.data.title ?? "Judul Buku"}
        </h2>
        <p
          id="detail-synopsis"
          className="font-sans text-lg md:text-xl text-graphite mb-12 max-w-md leading-relaxed"
        >
          {activeBook?.data.synopsis ??
            "Sinopsis singkat buku akan muncul di sini."}
        </p>

        <div className="flex items-center gap-6 mt-auto md:mt-0">
          <button
            ref={btnAddRef}
            id="btn-add-cart"
            onClick={handleAddToCart}
            className="btn-add bg-ink text-paper py-4 px-8 rounded-full font-sans text-sm uppercase tracking-widest hover:bg-graphite"
          >
            <span className="btn-text-original inline-block transition-transform duration-500">
              Add to Collection
            </span>
            <span className="btn-text-success">Telah Ditambahkan</span>
          </button>
          <span className="font-serif italic text-xl text-graphite">
            {price}
          </span>
        </div>
      </div>
    </div>
  );
}
