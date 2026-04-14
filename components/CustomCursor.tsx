"use client";

// CustomCursor.tsx
// Renders the custom cursor dot that follows the mouse.
// Grows into a "Read" label when hovering over book items.

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorText = cursorTextRef.current;
    if (!cursor || !cursorText) return;

    // Follow mouse pointer with GSAP
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });

      if (!cursor.classList.contains("active")) {
        cursor.classList.add("active");
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    // Hover scale for all interactive elements
    const interactiveEls = document.querySelectorAll<HTMLElement>(
      "a, button, [data-cursor]"
    );

    const onEnter = () => {
      cursor.style.transform = "translate(-50%, -50%) scale(2)";
      cursor.style.mixBlendMode = "difference";
    };
    const onLeave = () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      cursor.style.mixBlendMode = "";
    };

    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // Book item hover — expand cursor and show text
    const bookItems = document.querySelectorAll<HTMLElement>(".book-item");

    const onBookEnter = (e: Event) => {
      const item = e.currentTarget as HTMLElement;
      cursor.classList.add("hover-book");

      const text = item.getAttribute("data-cursor-text") || "Read";
      cursorText.innerText = text;
      cursorText.classList.remove("opacity-0");

      // Show book meta (archive section)
      const meta = item.querySelector<HTMLElement>(".book-meta");
      if (meta) gsap.to(meta, { opacity: 1, duration: 0.5 });

      // Dynamic background change
      const bgColor = item.getAttribute("data-bg");
      if (bgColor) document.body.style.backgroundColor = bgColor;
    };

    const onBookLeave = (e: Event) => {
      const item = e.currentTarget as HTMLElement;
      cursor.classList.remove("hover-book");
      cursorText.classList.add("opacity-0");

      const meta = item.querySelector<HTMLElement>(".book-meta");
      if (meta) gsap.to(meta, { opacity: 0, duration: 0.3 });
    };

    bookItems.forEach((item) => {
      item.addEventListener("mouseenter", onBookEnter);
      item.addEventListener("mouseleave", onBookLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      interactiveEls.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      bookItems.forEach((item) => {
        item.removeEventListener("mouseenter", onBookEnter);
        item.removeEventListener("mouseleave", onBookLeave);
      });
    };
  }, []);

  return (
    <div id="cursor" ref={cursorRef} aria-hidden="true">
      <span
        id="cursor-text"
        ref={cursorTextRef}
        className="opacity-0 transition-opacity duration-300"
      >
        Read
      </span>
    </div>
  );
}
