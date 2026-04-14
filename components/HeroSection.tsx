"use client";

// HeroSection.tsx
// Section 01: The Manifesto / Hero
// Includes the Navbar (header) inline, hero title with clip-path reveal animation,
// and ScrollTrigger fade+blur on scroll-out.

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleLinesRef = useRef<HTMLSpanElement[]>([]);

  // Collect title-line elements
  const addToTitleLines = (el: HTMLSpanElement | null) => {
    if (el && !titleLinesRef.current.includes(el)) {
      titleLinesRef.current.push(el);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const lines = titleLinesRef.current;

    // 1. Hero title reveal animation
    const heroTl = gsap.timeline();
    heroTl.to(lines, {
      y: "0%",
      duration: 1.5,
      stagger: 0.15,
      ease: "power4.out",
      delay: 0.2,
    });

    // 2. Fade + blur on scroll
    gsap.to(section, {
      opacity: 0,
      filter: "blur(10px)",
      y: 100,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-section relative w-full h-screen flex flex-col justify-between p-8 md:p-12 overflow-hidden"
    >
      {/* ── Navbar ── */}
      <header className="flex justify-between items-center z-10 font-sans text-sm uppercase tracking-widest">
        <div className="font-bold tracking-widest text-ink">Literia.</div>
        <nav className="hidden md:flex gap-8 text-graphite">
          <Link
            href="#archive"
            className="hover:text-ink transition-colors"
            data-cursor="Click"
          >
            Archive
          </Link>
          <Link
            href="#libreria"
            className="hover:text-ink transition-colors"
            data-cursor="Click"
          >
            Journal
          </Link>
          <Link
            href="#author"
            className="hover:text-ink transition-colors"
            data-cursor="Click"
          >
            About
          </Link>
        </nav>
        <div className="cursor-pointer text-ink" data-cursor="Menu">
          Menu
        </div>
      </header>

      {/* ── Hero Content ── */}
      <div className="flex flex-col md:flex-row justify-between items-end pb-12 z-10">
        {/* Big title */}
        <h1 className="font-serif text-huge text-ink w-full md:w-2/3 title-mask">
          <div className="overflow-hidden">
            <span className="title-line" ref={addToTitleLines}>
              Membaca
            </span>
          </div>
          <div className="overflow-hidden">
            <span className="title-line" ref={addToTitleLines}>
              Ulang
            </span>
          </div>
          <div className="overflow-hidden">
            <span
              className="title-line text-saddle italic pr-4"
              ref={addToTitleLines}
            >
              Dunia.
            </span>
          </div>
        </h1>

        {/* Side copy */}
        <div className="w-full md:w-1/4 mt-12 md:mt-0 title-mask">
          <div className="overflow-hidden">
            <p
              className="font-sans text-sm md:text-base text-graphite leading-relaxed text-justify title-line"
              ref={addToTitleLines}
            >
              Literia bukan sekadar tempat menemukan bacaan. Kami adalah ruang
              kontemplasi digital, mengkurasi literatur yang mendefinisikan
              ulang cara kita melihat realitas, lembar demi lembar.
            </p>
          </div>
          <div className="overflow-hidden mt-6">
            <p
              className="font-sans text-xs uppercase tracking-widest text-ink title-line font-semibold"
              ref={addToTitleLines}
            >
              Scroll untuk mengeksplorasi ↓
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
