"use client";

// ArchiveSection.tsx
// Section 02: The Archive — horizontal scroll with pinned section,
// 3D tilt effect on book covers, dynamic background color change on hover,
// and book click → opens the detail overlay via onBookClick callback.

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export interface BookData {
  id: string;
  src: string;
  alt: string;
  title: string;
  author: string;
  synopsis: string;
  bg: string;
  offsetTop?: boolean; // staggered vertical offset in the archive row
}

export const ARCHIVE_BOOKS: BookData[] = [
  {
    id: "arch-1",
    src: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    alt: "Book Cover 1",
    title: "The Architecture of Silence",
    author: "Elias Thorne",
    synopsis:
      "Sebuah eksplorasi mendalam tentang bagaimana ruang kosong membentuk psikologi manusia modern dalam lanskap urban.",
    bg: "#E4DFD9",
    offsetTop: false,
  },
  {
    id: "arch-2",
    src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
    alt: "Book Cover 2",
    title: "Oceanic Feelings",
    author: "Maya Lin",
    synopsis:
      "Kumpulan esai puitis mengenai hubungan emosional antara manusia dan bentang alam yang tak terhingga.",
    bg: "#D8DCE0",
    offsetTop: true,
  },
  {
    id: "arch-3",
    src: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
    alt: "Book Cover 3",
    title: "Warmth of The Sun",
    author: "Julian Barnes",
    synopsis:
      "Novel yang menggugah tentang memori, penyesalan, dan cahaya yang tersisa di masa senja kehidupan.",
    bg: "#E3D7D1",
    offsetTop: false,
  },
  {
    id: "arch-4",
    src: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=800&auto=format&fit=crop",
    alt: "Book Cover 4",
    title: "Botanical Geometry",
    author: "Dr. Aris V.",
    synopsis:
      "Studi visual menakjubkan tentang pola matematis sempurna yang tersembunyi dalam struktur tanaman sehari-hari.",
    bg: "#D3DAD6",
    offsetTop: true,
  },
];

interface ArchiveSectionProps {
  onBookClick: (book: BookData, imgEl: HTMLImageElement) => void;
}

export default function ArchiveSection({ onBookClick }: ArchiveSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;

    // ── 1. Horizontal scroll (desktop only) ──
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const getScrollAmount = () => -(wrapper.scrollWidth - window.innerWidth);

      gsap.to(wrapper, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${wrapper.scrollWidth * 0.6}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    // ── 2. Reset bg color when leaving archive ──
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onLeave: () => {
        document.body.style.backgroundColor = "var(--bg-color)";
      },
      onLeaveBack: () => {
        document.body.style.backgroundColor = "var(--bg-color)";
      },
    });

    // ── 3. 3D Tilt on book covers ──
    const wrappers =
      section.querySelectorAll<HTMLDivElement>(".book-cover-wrapper");

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
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      id="archive"
      ref={sectionRef}
      className="archive-section relative w-full h-screen bg-transparent flex items-center overflow-hidden"
    >
      <div
        ref={wrapperRef}
        className="archive-wrapper gap-12 md:gap-16 items-center"
      >
        {/* Section title card */}
        <div className="w-[30vw] shrink-0 pl-8 md:pl-12">
          <h2 className="font-serif text-5xl md:text-7xl mb-6">
            The
            <br />
            <span className="italic text-graphite">Archive</span>
          </h2>
          <p className="font-sans text-sm text-graphite max-w-xs">
            Koleksi terkurasi dari pikiran-pikiran paling cemerlang abad ini.
            Sentuh untuk merasakan teksturnya.
          </p>
        </div>

        {/* Books */}
        {ARCHIVE_BOOKS.map((book) => (
          <div
            key={book.id}
            className={`book-item shrink-0 w-[65vw] md:w-[20vw] flex flex-col items-center gap-6 cursor-pointer${
              book.offsetTop ? " mt-16" : ""
            }`}
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
                sizes="(max-width: 768px) 65vw, 20vw"
              />
            </div>
            <div className="text-center opacity-0 book-meta transition-opacity duration-500">
              <h3 className="font-serif text-2xl">{book.title}</h3>
              <p className="font-sans text-xs uppercase tracking-widest text-graphite mt-2">
                {book.author}
              </p>
            </div>
          </div>
        ))}

        {/* End padding spacer */}
        <div className="w-[10vw] shrink-0" />
      </div>
    </section>
  );
}
