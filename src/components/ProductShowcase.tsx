import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import luxurySofa from "@/assets/luxury-sofa.jpg";
import arabianMajlis from "@/assets/arabian-majlis.jpg";
import tvStand from "@/assets/tv stand/tvmain.jpg";

const products = [
  {
    title: "Luxury Sofas",
    subtitle: "Modern Opulence, Unmatched Comfort",
    description:
      "Sink into the embrace of Italian-grade velvet, hand-tufted with precision over kiln-dried hardwood frames. Each sofa is a masterwork — from the brushed gold legs to the cloud-soft high-density cushioning. Designed for Addis Ababa's most discerning homes, where every detail whispers prestige.",
    features: ["Premium Italian Velvet", "Hand-Tufted Detailing", "Brushed Gold Hardware", "10-Year Frame Warranty"],
    image: luxurySofa,
    alt: "Premium luxury sofa with navy velvet upholstery and gold legs - available in Addis Ababa",
    link: "/luxury-sofas",
  },
  {
    title: "Arabian Majlis",
    subtitle: "Heritage Reimagined in Splendor",
    description:
      "A celebration of centuries-old gathering traditions, our Majlis collections transform any room into a regal sanctuary. Rich brocade fabrics interwoven with gold threading, plush floor-level seating adorned with ornate bolster cushions — perfect for cultural gatherings, family evenings, or moments of quiet grandeur.",
    features: ["Authentic Brocade & Silk", "Custom Floor-Level Seating", "Handcrafted Geometric Patterns", "Tailored to Your Space"],
    image: arabianMajlis,
    alt: "Traditional Arabian Majlis seating with gold and burgundy fabrics - premium furniture Ethiopia",
    link: "/arabian-majlis",
  },
  {
    title: "Luxury TV Stands",
    subtitle: "Elevate Your Entertainment Space",
    description:
      "Transform your living room with our handcrafted luxury TV stands. Premium walnut, marble, and oak constructions with gold accents and intelligent cable management — designed to showcase your screen in style while keeping your space immaculate.",
    features: ["Premium Wood & Marble", "Integrated Cable Management", "Soft-Close Drawers", "Custom Sizes Available"],
    image: tvStand,
    alt: "Luxury TV stand with premium walnut wood and brass accents - available in Addis Ababa",
    link: "/luxury-tv-stands",
  },
];

const ProductShowcase = () => {
  return (
    <section id="collections" className="py-24 lg:py-32 bg-charcoal-gradient">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="font-accent text-base tracking-[0.3em] uppercase text-primary mb-4 block">
            Our Collections
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Crafted for the <span className="text-gold-gradient">Extraordinary</span>
          </h2>
          <div className="w-16 h-px bg-primary mx-auto mt-6" />
        </motion.div>

        {/* Products */}
        <div className="space-y-32">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-12 lg:gap-20 items-center`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.alt}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 border border-primary/20 pointer-events-none" />
                <div
                  className={`absolute -bottom-4 ${index % 2 === 0 ? "-right-4" : "-left-4"
                    } w-24 h-24 border border-primary/30 -z-10`}
                />
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2">
                <span className="font-accent text-sm tracking-[0.25em] uppercase text-primary mb-3 block">
                  {product.subtitle}
                </span>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {product.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-8 text-base">
                  {product.description}
                </p>
                <ul className="grid grid-cols-2 gap-3 mb-8">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-secondary-foreground font-body"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {product.link ? (
                  <Link
                    to={product.link}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm tracking-[0.1em] uppercase transition-all duration-300 hover:bg-gold-light hover:shadow-gold"
                  >
                    Explore More
                  </Link>
                ) : (
                  <a
                    href="tel:0911288820"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm tracking-[0.1em] uppercase transition-all duration-300 hover:bg-gold-light hover:shadow-gold"
                  >
                    Explore More
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
