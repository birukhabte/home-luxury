import { motion } from "framer-motion";
import heroImage from "@/assets/hero-living-room.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury living room with premium sofa and Arabian-inspired design in Addis Ababa"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-16 py-32">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-accent text-lg tracking-[0.3em] uppercase text-gold-light mb-6 block">
              Addis Ababa's Finest
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
          >
            <span className="text-foreground">Where Luxury</span>
            <br />
            <span className="text-gold-gradient">Meets Tradition</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg"
          >
            Handcrafted luxury sofas and authentic Arabian Majlis seating —
            designed for those who refuse to compromise on elegance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="tel:0911288820"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-body font-semibold text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:bg-gold-light hover:shadow-gold"
            >
              Book a Private Viewing
            </a>
            <a
              href="#collections"
              className="inline-flex items-center justify-center px-8 py-4 border border-gold-dark text-foreground font-body font-medium text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:bg-primary/10"
            >
              Explore Collections
            </a>
          </motion.div>

          {/* Product Category Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            {[
              { label: "Sofas", href: "/luxury-sofas" },
              { label: "Majlis", href: "/arabian-majlis" },
              { label: "TV Stand", href: "/luxury-tv-stands" },
              { label: "More", href: "#collections" },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.3 + i * 0.1 }}
                className="px-5 py-2 border border-primary/30 text-sm font-body tracking-[0.1em] uppercase text-foreground/80 hover:bg-primary/10 hover:border-primary hover:text-foreground transition-all duration-300 backdrop-blur-sm bg-background/10"
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative gold line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
      />
    </section>
  );
};

export default HeroSection;
