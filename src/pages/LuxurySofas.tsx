import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import luxurySofa from "@/assets/luxury-sofa.jpg";
import sofaNavy from "@/assets/sofa-navy-velvet.jpg";
import sofaCream from "@/assets/sofa-cream-leather.jpg";
import sofaEmerald from "@/assets/sofa-emerald.jpg";
import sofaBurgundy from "@/assets/sofa-burgundy.jpg";
import sofaCharcoal from "@/assets/sofa-charcoal.jpg";
import sofaCamel from "@/assets/sofa-camel.jpg";

const sofas = [
  {
    name: "The Sovereign",
    slug: "the-sovereign",
    material: "Italian Navy Velvet",
    description: "Hand-tufted navy velvet with brushed gold legs. A statement of modern opulence for the discerning homeowner.",
    image: luxurySofa,
  },
  {
    name: "The Midnight Royal",
    slug: "the-midnight-royal",
    material: "Deep Blue Velvet",
    description: "Rich deep blue velvet upholstery over a kiln-dried hardwood frame, paired with a gold-trimmed coffee table.",
    image: sofaNavy,
  },
  {
    name: "The Ivory Empress",
    slug: "the-ivory-empress",
    material: "Premium Italian Leather",
    description: "Cream Italian leather with nailhead detailing and gold base accents. Timeless elegance for grand living spaces.",
    image: sofaCream,
  },
  {
    name: "The Emerald Crown",
    slug: "the-emerald-crown",
    material: "Emerald Tufted Velvet",
    description: "A curved emerald chesterfield with brass legs. Bold, regal, and impossible to ignore.",
    image: sofaEmerald,
  },
  {
    name: "The Bordeaux Classic",
    slug: "the-bordeaux-classic",
    material: "Burgundy Velvet",
    description: "Deep burgundy chesterfield with button-tufted detailing and gold feet. Heritage craftsmanship meets modern luxury.",
    image: sofaBurgundy,
  },
  {
    name: "The Metropolitan",
    slug: "the-metropolitan",
    material: "Charcoal Linen Blend",
    description: "An L-shaped sectional in charcoal fabric with clean modern lines. Perfect for expansive contemporary living rooms.",
    image: sofaCharcoal,
  },
  {
    name: "The Sahara",
    slug: "the-sahara",
    material: "Camel Italian Leather",
    description: "Warm camel-toned leather with tufted back and gold legs. Mid-century sophistication for the modern connoisseur.",
    image: sofaCamel,
  },
];

const LuxurySofas = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-32 pb-16 bg-charcoal-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-accent text-base tracking-[0.3em] uppercase text-primary mb-4 block">
              Our Collection
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
              Luxury <span className="text-gold-gradient">Sofas</span>
            </h1>
            <p className="font-body text-muted-foreground text-lg max-w-2xl">
              Each piece is a masterwork of Italian-grade materials, precision craftsmanship, and timeless design — curated for Addis Ababa's most distinguished interiors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sofa Grid */}
      <section className="py-20 bg-charcoal-gradient">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sofas.map((sofa, index) => (
              <motion.div
                key={sofa.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden mb-5">
                  <img
                    src={sofa.image}
                    alt={`${sofa.name} - ${sofa.material} luxury sofa Addis Ababa`}
                    width={768}
                    height={768}
                    loading="lazy"
                    className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 border border-primary/10 pointer-events-none group-hover:border-primary/30 transition-colors duration-300" />
                </div>
                <span className="font-accent text-xs tracking-[0.25em] uppercase text-primary block mb-1">
                  {sofa.material}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {sofa.name}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                  {sofa.description}
                </p>
                <Link
                  to={`/sofa-order/${sofa.slug}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-gold-light transition-colors font-body text-sm font-semibold tracking-[0.1em] uppercase"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Order Now
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-charcoal-gradient border-t border-border">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Didn't Find What You're Looking For?
            </h2>
            <p className="font-body text-muted-foreground mb-8 max-w-lg mx-auto">
              We craft bespoke pieces tailored to your vision. Call us for a private consultation.
            </p>
            <a
              href="tel:0911288820"
              className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-body font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:bg-gold-light hover:shadow-gold"
            >
              Schedule Consultation
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LuxurySofas;
