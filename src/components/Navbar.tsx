import { useState, useEffect } from "react";
import { Phone, Youtube } from "lucide-react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.88a8.28 8.28 0 0 0 4.76 1.5V6.93a4.84 4.84 0 0 1-1-.24z" />
  </svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between h-20">
        <a href="/" className="font-display text-lg md:text-xl font-bold text-foreground tracking-wide leading-tight">
          Home Luxury<span className="text-primary"> Furniture</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#collections" className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            Collections
          </a>
          <a href="#contact" className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            Showroom
          </a>

          {/* Social Links */}
          <div className="flex items-center gap-3 border-l border-border pl-6">
            <a
              href="https://www.tiktok.com/@homeluxuryfurnituresofa?_r=1&_t=ZS-95KjBKCbu3Z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted/30 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.youtube.com/@realarabianmajlissofa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted/30 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300"
              aria-label="YouTube"
            >
              <Youtube className="w-3.5 h-3.5" />
            </a>
          </div>

          <a
            href="tel:0911288820"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-xs tracking-[0.15em] uppercase hover:bg-gold-light transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            Call Now
          </a>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-3">
          <a
            href="https://www.tiktok.com/@homeluxuryfurnituresofa?_r=1&_t=ZS-95KjBKCbu3Z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted/30 text-muted-foreground hover:text-primary transition-colors"
            aria-label="TikTok"
          >
            <TikTokIcon className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://www.youtube.com/@realarabianmajlissofa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted/30 text-muted-foreground hover:text-primary transition-colors"
            aria-label="YouTube"
          >
            <Youtube className="w-3.5 h-3.5" />
          </a>
          <a
            href="tel:0911288820"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body font-semibold text-xs tracking-[0.1em] uppercase"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
