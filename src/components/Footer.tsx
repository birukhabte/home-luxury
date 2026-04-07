const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-display text-lg font-bold text-foreground tracking-wide">
              Home Luxury<span className="text-primary"> Furniture</span>
            </span>
            <p className="font-body text-xs text-muted-foreground mt-1">
              Sofa, Arabian Majlis & TV Stand Shopping · Addis Ababa, Ethiopia
            </p>
          </div>
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} Home Luxury Furniture. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
