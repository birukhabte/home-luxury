import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between h-20">
        <Link to="/" className="font-display text-lg md:text-xl font-bold text-foreground tracking-wide leading-tight">
          Home Luxury<span className="text-primary"> Furniture</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/luxury-sofas" className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            Sofas
          </Link>
          <Link to="/arabian-majlis" className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            Majlis
          </Link>
          <Link to="/luxury-tv-stands" className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            TV Stands
          </Link>
          <a href="#collections" className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            More
          </a>
          <a href="#contact" className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            Showroom
          </a>
          
          {/* Social Media Links */}
          <div className="flex items-center gap-3 ml-4">
            <a
              href="https://www.tiktok.com/@homeluxuryfurnituresofa?_r=1&_t=ZS-95KjBKCbu3Z"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Follow us on TikTok"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@realarabianmajlissofathen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Subscribe to our YouTube channel"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
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

        <a
          href="tel:0911288820"
          className="md:hidden inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body font-semibold text-xs tracking-[0.1em] uppercase"
        >
          <Phone className="w-3.5 h-3.5" />
          Call
        </a>
      </div>
    </nav>
  );
};

export default Navbar;