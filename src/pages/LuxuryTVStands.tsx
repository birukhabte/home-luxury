import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  X,
  Phone,
  MessageCircle,
  Clock,
  Flame,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Star,
  Palette,
  Ruler,
  Sparkles,
  Monitor,
  Zap,
  Shield,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiGet } from "@/lib/api";
import { getProductDetailUrl } from "@/lib/slugs";
import tvMain from "@/assets/tv stand/tvmain.jpg";
import tv2 from "@/assets/tv stand/tv2.jpg";
import tv3 from "@/assets/tv stand/tv3.jpg";
import tv4 from "@/assets/tv stand/tv4.jpg";
import tv5 from "@/assets/tv stand/tv5.jpg";
import tv6 from "@/assets/tv stand/tv6.jpg";

type Category = "Luxury Sofas" | "Arabian Majlis" | "Luxury TV Stands";

interface Product {
  id: string;
  name: string;
  category: Category;
  material: string;
  description?: string;
  price: string;
  originalPrice?: string;
  discountPrice?: string;
  status: string;
  imageUrl?: string;
  imageUrls?: string[];
}

const WHATSAPP_NUMBER = "251911288820";
const PHONE_NUMBER = "0995871152";

const tvStands = [
  {
    name: "The Imperial Console",
    slug: "the-imperial-console",
    material: "Walnut & Brass",
    description: "Premium walnut wood with brass inlay details and soft-close drawers. A centerpiece for your entertainment space.",
    image: tvMain,
    originalPrice: "45,000",
    discountedPrice: "32,000",
    stock: 3,
    badge: "Best Seller",
  },
  {
    name: "The Monarch Stand",
    slug: "the-monarch-stand", 
    material: "Oak & Gold Accents",
    description: "Solid oak construction with gold-plated handles and integrated LED lighting. Modern luxury meets functionality.",
    image: tv2,
    originalPrice: "38,000",
    discountedPrice: "28,500",
    stock: 2,
    badge: "Limited Offer",
  },
  {
    name: "The Prestige Unit",
    slug: "the-prestige-unit",
    material: "Marble & Steel",
    description: "Italian marble top with brushed steel frame. Contemporary elegance for the modern home.",
    image: tv3,
    originalPrice: "52,000",
    discountedPrice: "39,000",
    stock: 1,
    badge: "Only 1 Left",
  },
  {
    name: "The Regal Cabinet",
    slug: "the-regal-cabinet",
    material: "Mahogany & Bronze",
    description: "Rich mahogany wood with bronze hardware and hand-carved details. Timeless sophistication.",
    image: tv4,
    originalPrice: "42,000",
    discountedPrice: "31,500",
    stock: 4,
    badge: "New Arrival",
  },
  {
    name: "The Executive Media Center",
    slug: "the-executive-media-center",
    material: "Ebony & Chrome",
    description: "Sleek ebony finish with chrome accents and floating design. Perfect for contemporary interiors.",
    image: tv5,
    originalPrice: "48,000",
    discountedPrice: "36,000",
    stock: 2,
    badge: "Hot Deal",
  },
  {
    name: "The Grand Entertainment Unit",
    slug: "the-grand-entertainment-unit",
    material: "Teak & Gold Leaf",
    description: "Expansive teak wood unit with gold leaf detailing. Designed for large living spaces and home theaters.",
    image: tv6,
    originalPrice: "65,000",
    discountedPrice: "48,750",
    stock: 3,
    badge: "Popular",
  },
];

const valueProps = [
  { icon: Monitor, label: "Premium Materials", desc: "Solid wood and premium finishes" },
  { icon: Zap, label: "Smart Cable Management", desc: "Integrated wire organization systems" },
  { icon: Shield, label: "Built to Last", desc: "10-year structural warranty" },
  { icon: Settings, label: "Custom Sizing", desc: "Tailored to your space requirements" },
];

const LuxuryTVStands = () => {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [backendConnected, setBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    apiGet<any[]>("/products")
      .then((data) => {
        const mapped: Product[] = data
          .map((p: any) => ({
            id: p.id || p._id,
            name: p.name,
            category: p.category,
            material: p.material,
            description: p.description,
            price: p.price,
            originalPrice: p.originalPrice,
            discountPrice: p.discountPrice,
            status: p.status,
            imageUrl: p.imageUrl,
            imageUrls: p.imageUrls || [],
          }))
          .filter((p) => p.category === "Luxury TV Stands" && p.status === "Active");
        setDbProducts(mapped);
        setBackendConnected(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load TV stands from backend", err);
        setBackendConnected(false);
        setLoading(false);
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
              Luxury <span className="text-gold-gradient">TV Stands</span>
            </h1>
            <p className="font-body text-muted-foreground text-lg max-w-2xl">
              Elevate your entertainment space with our handcrafted TV stands. Each piece combines premium materials with intelligent design for the ultimate viewing experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-16 bg-charcoal-gradient">
          <div className="container mx-auto px-6 lg:px-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading luxury TV stands...</p>
          </div>
        </section>
      )}

      {/* Backend Products (when connected) */}
      {!loading && backendConnected && dbProducts.length > 0 && (
        <section className="py-16 bg-charcoal-gradient">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="mb-10">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Available TV Stands
              </h2>
              <p className="font-body text-sm text-muted-foreground max-w-xl">
                Premium collection managed from our admin panel.
              </p>
            </div>
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
                    className="group cursor-pointer"
                    onClick={() => navigate(getProductDetailUrl(product.name))}
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
                      {/* Only show Limited Offer badge if there's a discount */}
                      {product.discountPrice && product.originalPrice && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <Flame className="w-3 h-3" /> Limited Offer
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
                    {/* Show discount pricing if available, otherwise show regular price */}
                    {product.discountPrice && product.originalPrice ? (
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="font-display text-lg font-bold text-primary">
                          {product.discountPrice}
                        </span>
                        <span className="font-body text-sm text-muted-foreground line-through">
                          {product.originalPrice}
                        </span>
                      </div>
                    ) : product.price ? (
                      <p className="font-body text-sm text-muted-foreground mb-3">{product.price}</p>
                    ) : null}
                    <span className="inline-flex items-center gap-1.5 text-primary hover:text-gold-light transition-colors font-body text-sm font-semibold tracking-[0.1em] uppercase">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      View Details →
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Hardcoded TV Stands (when backend not connected or no products) */}
      {!loading && (!backendConnected || dbProducts.length === 0) && (
        <section className="py-20 bg-charcoal-gradient">
          <div className="container mx-auto px-6 lg:px-16">
            {!backendConnected && (
              <div className="mb-10 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Backend not connected. Showing demo collection.
                </p>
              </div>
            )}
            <div className="mb-10">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Available TV Stands
              </h2>
              <p className="font-body text-sm text-muted-foreground max-w-xl">
                Demo collection showcasing our premium TV stand range.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tvStands.map((stand, index) => (
                <motion.div
                  key={stand.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(getProductDetailUrl(stand.name))}
                >
                  <div className="relative overflow-hidden mb-5">
                    <img
                      src={stand.image}
                      alt={`${stand.name} - ${stand.material} luxury TV stand Addis Ababa`}
                      width={768}
                      height={768}
                      loading="lazy"
                      className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Limited Offer
                    </div>
                    <div className="absolute inset-0 border border-primary/10 pointer-events-none group-hover:border-primary/30 transition-colors duration-300" />
                  </div>

                  <span className="font-accent text-xs tracking-[0.25em] uppercase text-primary block mb-1">
                    {stand.material}
                  </span>
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">{stand.name}</h3>
                  
                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-display text-lg font-bold text-primary">
                      {stand.discountedPrice} ETB
                    </span>
                    <span className="font-body text-sm text-muted-foreground line-through">
                      {stand.originalPrice} ETB
                    </span>
                  </div>
                  
                  <span className="inline-flex items-center gap-1.5 text-primary hover:text-gold-light transition-colors font-body text-sm font-semibold tracking-[0.1em] uppercase">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    View Details →
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Value Props Section */}
      <section className="py-12 bg-charcoal-gradient border-t border-border/40">
        <div className="container mx-auto px-6 lg:px-16">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
            Why Choose <span className="text-gold-gradient">Our TV Stands</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {valueProps.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="text-center">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 border border-primary/20 mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-body text-sm font-bold text-foreground mb-1">{label}</h3>
                <p className="font-body text-xs text-muted-foreground">{desc}</p>
              </div>
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
              Need a Custom TV Stand?
            </h2>
            <p className="font-body text-muted-foreground mb-8 max-w-lg mx-auto">
              We create bespoke TV stands tailored to your exact specifications, room size, and style preferences.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-body font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:bg-gold-light hover:shadow-gold"
              >
                <Phone className="w-4 h-4" />
                Schedule Consultation
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I'd like to schedule a consultation for a custom TV stand.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-green-600 text-white font-body font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:bg-green-500"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LuxuryTVStands;