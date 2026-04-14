"use client";

// LibreriaSection.tsx
// Section 03: Full catalog grid with category filter buttons and pagination UI.
// Clicking a book triggers the detail overlay via onBookClick callback.

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import type { BookData } from "./ArchiveSection";

const CATEGORIES = ["All Books", "Fiction", "Philosophy", "Art & Design", "Science"] as const;
type Category = (typeof CATEGORIES)[number];

export interface CatalogBook extends Omit<BookData, "offsetTop"> {
  category: Exclude<Category, "All Books">;
  price: string;
}

const CATALOG_BOOKS: CatalogBook[] = [
  {
    id: "cat-1",
    src: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=800&auto=format&fit=crop",
    alt: "Catalog Book 1",
    title: "Echoes of Eternity",
    author: "Sarah Jenkins",
    synopsis:
      "Kisah fiksi ilmiah tentang perjalanan waktu dan dampaknya pada ingatan manusia di masa depan yang tidak pasti.",
    bg: "#F7F5F0",
    category: "Fiction",
    price: "$18.50",
  },
  {
    id: "cat-2",
    src: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop",
    alt: "Catalog Book 2",
    title: "The Mind's Eye",
    author: "Marcus Aurelius",
    synopsis:
      "Kompilasi pemikiran stoikisme untuk menghadapi tantangan kehidupan modern dengan ketenangan.",
    bg: "#F7F5F0",
    category: "Philosophy",
    price: "$22.00",
  },
  {
    id: "cat-3",
    src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
    alt: "Catalog Book 3",
    title: "Color Theory",
    author: "Johannes Itten",
    synopsis:
      "Penelitian mendalam mengenai bagaimana warna mempengaruhi psikologi estetika dan komunikasi visual.",
    bg: "#F7F5F0",
    category: "Art & Design",
    price: "$35.00",
  },
  {
    id: "cat-4",
    src: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    alt: "Catalog Book 4",
    title: "Quantum Reality",
    author: "Dr. Neil Watts",
    synopsis:
      "Penjelasan sederhana mengenai teori fisika mekanika kuantum yang revolusioner bagi orang awam.",
    bg: "#F7F5F0",
    category: "Science",
    price: "$28.00",
  },
  {
    id: "cat-5",
    src: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
    alt: "Catalog Book 5",
    title: "Lost Letters",
    author: "Elena Ferrante",
    synopsis:
      "Novel sejarah tentang wanita yang mencari saudara perempuannya yang hilang saat perang di Italia masa lampau.",
    bg: "#F7F5F0",
    category: "Fiction",
    price: "$21.00",
  },
  {
    id: "cat-6",
    src: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
    alt: "Catalog Book 6",
    title: "Abstract Thoughts",
    author: "Jean-Paul Sartre",
    synopsis:
      "Diskusi mendalam mengenai kebebasan dan eksistensialisme dalam konteks masyarakat abad ke-21.",
    bg: "#F7F5F0",
    category: "Philosophy",
    price: "$19.50",
  },
  {
    id: "cat-7",
    src: "https://images.unsplash.com/photo-1507738978512-35798112892c?q=80&w=800&auto=format&fit=crop",
    alt: "Catalog Book 7",
    title: "Type & Space",
    author: "Massimo Vignelli",
    synopsis:
      "Panduan tipografi esensial dan pemahaman grid tata letak untuk desainer grafis masa kini.",
    bg: "#F7F5F0",
    category: "Art & Design",
    price: "$42.00",
  },
  {
    id: "cat-8",
    src: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=800&auto=format&fit=crop",
    alt: "Catalog Book 8",
    title: "Space & Time",
    author: "Stephen Hawking",
    synopsis:
      "Sebuah pemahaman baru tentang keajaiban alam semesta mulai dari lubang hitam hingga teori dawai.",
    bg: "#F7F5F0",
    category: "Science",
    price: "$25.00",
  },
];

interface LibreriaSectionProps {
  onBookClick: (book: CatalogBook, imgEl: HTMLImageElement) => void;
}

export default function LibreriaSection({ onBookClick }: LibreriaSectionProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("All Books");
  const sectionRef = useRef<HTMLElement>(null);

  const filteredBooks =
    activeCategory === "All Books"
      ? CATALOG_BOOKS
      : CATALOG_BOOKS.filter((b) => b.category === activeCategory);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const wrappers = section.querySelectorAll<HTMLDivElement>(".book-cover-wrapper");
    const cleanupFns: (() => void)[] = [];

    wrappers.forEach((bw) => {
      const cover = bw.querySelector<HTMLImageElement>(".book-cover");
      if (!cover) return;

      const onMove = (e: MouseEvent) => {
        const rect = bw.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -15;
        const rotateY = ((x - cx) / cx) * 15;

        gsap.to(cover, {
          rotateX,
          rotateY,
          duration: 0.5,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      };

      const onLeave = () => {
        gsap.to(cover, {
          rotateX: 0,
          rotateY: 0,
          duration: 1,
          ease: "elastic.out(1, 0.3)",
        });
      };

      bw.addEventListener("mousemove", onMove);
      bw.addEventListener("mouseleave", onLeave);

      cleanupFns.push(() => {
        bw.removeEventListener("mousemove", onMove);
        bw.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [filteredBooks]);

  return (
    <section
      id="libreria"
      ref={sectionRef}
      className="catalog-section relative w-full bg-paper py-24 px-8 md:px-12 z-10 border-t border-graphite/20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="font-serif text-5xl md:text-7xl mb-4 text-ink">
              Libreria.
            </h2>
            <p className="font-sans text-sm text-graphite max-w-md">
              Eksplorasi koleksi literatur kami yang lebih dalam. Temukan
              berbagai genre dan pemikiran terkurasi.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex gap-6 mt-8 md:mt-0 overflow-x-auto w-full md:w-auto pb-4 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-cursor="Filter"
                className={`font-sans text-xs uppercase tracking-widest pb-1 whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "text-ink border-b border-ink"
                    : "text-graphite hover:text-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Book grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="book-item flex flex-col items-center gap-4 cursor-pointer"
              data-cursor-text="Read"
              data-bg={book.bg}
              onClick={() => {
                const imgEl = document
                  .getElementById(book.id)
                  ?.querySelector<HTMLImageElement>(".book-cover");
                if (imgEl) onBookClick(book, imgEl);
              }}
              id={book.id}
            >
              <div className="w-full aspect-[2/3] relative book-cover-wrapper">
                <Image
                  src={book.src}
                  alt={book.alt}
                  fill
                  className="object-cover book-cover rounded-sm"
                  data-title={book.title}
                  data-author={book.author}
                  data-synopsis={book.synopsis}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="text-left w-full mt-2">
                <h3 className="font-serif text-2xl truncate w-full">
                  {book.title}
                </h3>
                <div className="flex justify-between items-center mt-2 w-full">
                  <p className="font-sans text-[10px] uppercase tracking-widest text-graphite">
                    {book.category}
                  </p>
                  <p className="font-serif italic text-sm text-ink font-semibold">
                    {book.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center mt-24 gap-4 pb-12">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full border border-graphite/30 text-graphite hover:border-ink hover:text-ink transition-all duration-300 hover:-translate-x-1"
            data-cursor="Prev"
            aria-label="Previous page"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 2L3 7L8 12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          <div className="flex items-center gap-2 font-sans text-sm">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                data-cursor={String(n)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                  n === 1
                    ? "bg-ink text-paper"
                    : "text-graphite hover:text-ink hover:bg-sand"
                }`}
              >
                {n}
              </button>
            ))}
            <span className="text-graphite w-6 text-center">...</span>
            <button
              data-cursor="12"
              className="w-10 h-10 flex items-center justify-center rounded-full text-graphite hover:text-ink hover:bg-sand transition-colors"
            >
              12
            </button>
          </div>

          <button
            className="w-10 h-10 flex items-center justify-center rounded-full border border-graphite/30 text-graphite hover:border-ink hover:text-ink transition-all duration-300 hover:translate-x-1"
            data-cursor="Next"
            aria-label="Next page"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 2L11 7L6 12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
