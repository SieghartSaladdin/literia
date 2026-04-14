"use client";

// AuthorSection.tsx
// Section 04: Author Spotlight
// - Vertical parallax on the grayscale author image via ScrollTrigger
// - SVG displacement filter hover effect (simulates WebGL water/wind)

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function AuthorSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const filterTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const img = imageRef.current;
    if (!section || !img) return;

    // ── 1. Parallax scroll ──
    gsap.to(img, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // ── 2. SVG displacement filter on hover ──
    const filterMap = document.getElementById(
      "displacementMap"
    ) as SVGFEDisplacementMapElement | null;

    if (filterMap) {
      const tl = gsap.timeline({ paused: true });
      tl.to(filterMap, {
        attr: { scale: 30 },
        duration: 1.5,
        ease: "power2.out",
      });
      filterTimelineRef.current = tl;

      const onEnter = () => {
        tl.play();
        const cursor = document.getElementById("cursor");
        const cursorText = document.getElementById("cursor-text");
        if (cursor) cursor.classList.add("hover-book");
        if (cursorText) {
          cursorText.innerText = "Listen";
          cursorText.classList.remove("opacity-0");
        }
      };

      const onLeave = () => {
        tl.reverse();
        const cursor = document.getElementById("cursor");
        const cursorText = document.getElementById("cursor-text");
        if (cursor) cursor.classList.remove("hover-book");
        if (cursorText) cursorText.classList.add("opacity-0");
      };

      section.addEventListener("mouseenter", onEnter);
      section.addEventListener("mouseleave", onLeave);

      return () => {
        section.removeEventListener("mouseenter", onEnter);
        section.removeEventListener("mouseleave", onLeave);
        tl.kill();
      };
    }
  }, []);

  return (
    <section
      id="author"
      ref={sectionRef}
      className="author-section relative w-full h-screen overflow-hidden bg-ink text-paper flex items-center justify-center"
      data-cursor="Displace"
    >
      {/* Parallax image */}
      <div className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none z-0">
        <Image
          ref={imageRef}
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1288&auto=format&fit=crop"
          alt="Author Portrait"
          fill
          className="object-cover grayscale opacity-40 author-img"
          id="author-image"
          sizes="100vw"
          priority={false}
        />
      </div>

      {/* Quote content */}
      <div
        className="relative z-10 text-center max-w-4xl px-8"
        data-cursor="Displace"
      >
        <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-8">
          &ldquo;Setiap buku adalah{" "}
          <span className="italic font-light text-sand">kertas digital</span>{" "}
          yang menyerap jiwa pembacanya, tidak pernah sama ketika dibaca dua
          kali.&rdquo;
        </h2>
        <p className="font-sans text-sm uppercase tracking-widest text-sand/70">
          — The Voices, Literia Editorial
        </p>
      </div>
    </section>
  );
}
