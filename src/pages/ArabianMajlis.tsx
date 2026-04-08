import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import arabianMajlis from "@/assets/arabian-majlis.jpg";
import majlisBurgundyGold from "@/assets/majlis-burgundy-gold.jpg";
import majlisRoyalBlue from "@/assets/majlis-royal-blue.jpg";
import majlisCreamGold from "@/assets/majlis-cream-gold.jpg";
import majlisEmerald from "@/assets/majlis-emerald.jpg";
import majlisPurple from "@/assets/majlis-purple.jpg";
import majlisBrownBronze from "@/assets/majlis-brown-bronze.jpg";
import { apiGet } from "@/lib/api";

type Category = "Luxury Sofas" | "Arabian Majlis" | "Luxury TV Stands";

interface Product {
  id: string;
  name: string;
  category: Category;
  material: string;
  price: string;
  status: string;
  imageUrl?: string;
  imageUrls?: string[];
}

const majlisCollection = [
  {
    name: "The Grand Heritage",
    style: "Burgundy & Gold Brocade",
    description: "A regal masterpiece in rich burgundy and gold — hand-woven brocade fabric with ornate bolster cushions, perfect for grand cultural gatherings.",
    image: arabianMajlis,
  },
  {
    name: "The Royal Palace",
    style: "Classic Burgundy & Gold",
    description: "Lavish floor-level seating adorned with intricate gold threading on burgundy damask. A throne room for your home.",
    image: majlisBurgundyGold,
  },
  {
    name: "The Azure Majesty",
    style: "Royal Blue & Silver",
    description: "Stunning royal blue silk with silver geometric patterns. A breathtaking statement of opulence inspired by Ottoman grandeur.",
    image: majlisRoyalBlue,
  },
  {
    name: "The Golden Oasis",
    style: "Cream & Gold Silk",
    description: "Elegant cream silk seating with gold filigree accents and burgundy accent cushions. Refined luxury for sophisticated gatherings.",
    image: majlisCreamGold,
  },
  {
    name: "The Emerald Sanctuary",
    style: "Emerald & Gold Velvet",
    description: "Rich emerald velvet with gold damask patterns. A majestic gathering space that channels centuries of Arabian hospitality tradition.",
    image: majlisEmerald,
  },
  {
    name: "The Amethyst Throne",
    style: "Purple & Gold Velvet",
    description: "Deep purple tufted velvet with ornate gold cushions. Dramatic, bold, and unmistakably royal — for those who command attention.",
    image: majlisPurple,
  },
  {
    name: "The Desert King",
    style: "Brown Leather & Bronze",
    description: "Premium leather floor seating in warm earth tones with bronze accents. A perfect blend of Arabian tradition and contemporary comfort.",
    image: majlisBrownBronze,
  },
];

const ArabianMajlis = () => {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    apiGet<any[]>("/products")
      .then((data) => {
        const mapped: Product[] = data
          .map((p: any) => ({
            id: p.id || p._id,
            name: p.name,
            category: p.category,
            material: p.material,
            price: p.price,
            status: p.status,
            imageUrl: p.imageUrl,
            imageUrls: p.imageUrls || [],
          }))
          .filter((p) => p.category === "Arabian Majlis" && p.status === "Active");
        setDbProducts(mapped);
      })
      .catch((err) => {
        console.error("Failed to load majlis products from backend", err);
      });
  }, []);

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
              Arabian <span className="text-gold-gradient">Majlis</span>
            </h1>
            <p className="font-body text-muted-foreground text-lg max-w-2xl">
              A celebration of centuries-old gathering traditions — rich brocade, silk, and velvet transformed into regal sanctuaries for your home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Majlis Grid from Admin */}
      <section className="py-16 bg-charcoal-gradient border-b border-border/40">
        <div className="container mx-auto px-6 lg:px-16">
          {dbProducts.length > 0 && (
            <div className="mb-10">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Available Majlis Sets
              </h2>
              <p className="font-body text-sm text-muted-foreground max-w-xl">
                These Majlis sets are managed from the admin panel and reflect your live catalog.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dbProducts.map((product) => {
              const img = product.imageUrl || product.imageUrls?.[0];
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="group"
                >
                  <div className="relative overflow-hidden mb-5">
                    {img ? (
                      <img
                        src={img}
                        alt={product.name}
                        width={768}
                        height={768}
                        loading="lazy"
                        className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-muted/20 border border-border flex items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                    <div className="absolute inset-0 border border-primary/10 pointer-events-none group-hover:border-primary/30 transition-colors duration-300" />
                  </div>
                  <span className="font-accent text-xs tracking-[0.25em] uppercase text-primary block mb-1">
                    {product.material}
                  </span>
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">
                    {product.name}
                  </h3>
                  {product.price && (
                    <p className="font-body text-sm text-muted-foreground mb-3">
                      {product.price}
                    </p>
                  )}
                  <a
                    href="tel:0911288820"
                    className="inline-flex items-center gap-2 text-primary hover:text-gold-light transition-colors font-body text-sm font-semibold tracking-[0.1em] uppercase"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Inquire
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Static Majlis Grid */}
      <section className="py-20 bg-charcoal-gradient">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {majlisCollection.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden mb-5">
                  <img
                    src={item.image}
                    alt={`${item.name} - ${item.style} Arabian Majlis Addis Ababa`}
                    width={768}
                    height={768}
                    loading="lazy"
                    className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 border border-primary/10 pointer-events-none group-hover:border-primary/30 transition-colors duration-300" />
                </div>
                <span className="font-accent text-xs tracking-[0.25em] uppercase text-primary block mb-1">
                  {item.style}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {item.name}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                  {item.description}
                </p>
                <a
                  href="tel:0911288820"
                  className="inline-flex items-center gap-2 text-primary hover:text-gold-light transition-colors font-body text-sm font-semibold tracking-[0.1em] uppercase"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Inquire
                </a>
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
              Design Your Perfect Majlis
            </h2>
            <p className="font-body text-muted-foreground mb-8 max-w-lg mx-auto">
              Every Majlis is custom-crafted to your space, fabric preferences, and cultural vision. Let us bring your dream to life.
            </p>
            <a
              href="tel:0911288820"
              className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-body font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:bg-gold-light hover:shadow-gold"
            >
              <Phone className="w-4 h-4" />
              Schedule Consultation
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArabianMajlis;
