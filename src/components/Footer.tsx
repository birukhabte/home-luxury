const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <span className="font-display text-lg font-bold text-foreground tracking-wide">
              Home Luxury<span className="text-primary"> Furniture</span>
            </span>
            <p className="font-body text-xs text-muted-foreground mt-2">
              Sofa, Arabian Majlis & TV Stand Shopping · Addis Ababa, Ethiopia
            </p>
          </div>
          
          <div>
            <h3 className="font-display text-sm font-semibold text-foreground mb-3">Collections</h3>
            <div className="space-y-2">
              <a href="/luxury-sofas" className="block font-body text-xs text-muted-foreground hover:text-primary transition-colors">
                Luxury Sofas
              </a>
              <a href="/arabian-majlis" className="block font-body text-xs text-muted-foreground hover:text-primary transition-colors">
                Arabian Majlis
              </a>
              <a href="/luxury-tv-stands" className="block font-body text-xs text-muted-foreground hover:text-primary transition-colors">
                TV Stands
              </a>
              <a href="/products" className="block font-body text-xs text-muted-foreground hover:text-primary transition-colors">
                All Products
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display text-sm font-semibold text-foreground mb-3">Special Offers</h3>
            <div className="space-y-2">
              <a href="/promotions" className="block font-body text-xs text-red-500 hover:text-red-400 transition-colors">
                🔥 Current Promotions
              </a>
              <a href="tel:0995871152" className="block font-body text-xs text-muted-foreground hover:text-primary transition-colors">
                📞 Call for Deals
              </a>
              <a href="https://wa.me/251911288820" className="block font-body text-xs text-muted-foreground hover:text-primary transition-colors">
                💬 WhatsApp Expert
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-border">
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} Home Luxury Furniture. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// Commit 16 - 2024-05-07 09:56:00
// Commit 22 - 2024-05-10 17:05:00
// Commit 42 - 2024-05-21 00:36:00
