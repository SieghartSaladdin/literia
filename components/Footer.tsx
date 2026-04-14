// Footer.tsx — Server Component
// Section 05: The Colophon / Footer Reveal
// Fixed at the bottom with z-index: 1, revealed as the main-wrapper scrolls away.

export default function Footer() {
  return (
    <footer className="footer-reveal pt-24 pb-12 px-8 md:px-12">
      {/* Divider */}
      <div className="w-full h-px bg-graphite/30 mb-16" />

      <div className="flex flex-col md:flex-row justify-between h-full">
        {/* ── Left: Newsletter ── */}
        <div className="w-full md:w-1/2 mb-12 md:mb-0">
          <h3 className="font-serif text-4xl md:text-5xl mb-6">
            Join The Reading Club
          </h3>
          <form
            className="relative max-w-md mt-12"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Alamat Email Anda"
              className="w-full bg-transparent border-b border-paper/30 pb-4 outline-none font-sans text-lg focus:border-paper transition-colors rounded-none placeholder:text-graphite"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="absolute right-0 bottom-4 font-sans text-xs uppercase tracking-widest hover:text-sand transition-colors"
              data-cursor="Submit"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* ── Right: Colophon ── */}
        <div className="w-full md:w-1/3 flex flex-col justify-between font-sans text-sm text-graphite">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-paper uppercase tracking-widest text-xs mb-4">
                Location
              </h4>
              <p className="leading-relaxed">
                Jl. Sastra No. 42
                <br />
                Jakarta Selatan, 12190
                <br />
                Indonesia
              </p>
            </div>
            <div>
              <h4 className="text-paper uppercase tracking-widest text-xs mb-4">
                Social
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-paper transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-paper transition-colors">
                    Twitter (X)
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-paper transition-colors">
                    Goodreads
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 md:mt-0 flex justify-between items-end border-t border-graphite/30 pt-4">
            <p>© 2026 Literia Publishing</p>
            <p>ISBN Registry: 978-602-000</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
