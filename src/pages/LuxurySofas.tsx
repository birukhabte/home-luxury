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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import luxurySofa from "@/assets/luxury-sofa.jpg";
import sofaNavy from "@/assets/sofa-navy-velvet.jpg";
import sofaCream from "@/assets/sofa-cream-leather.jpg";
import sofaEmerald from "@/assets/sofa-emerald.jpg";
import sofaBurgundy from "@/assets/sofa-burgundy.jpg";
import sofaCharcoal from "@/assets/sofa-charcoal.jpg";
import sofaCamel from "@/assets/sofa-camel.jpg";
import { apiGet } from "@/lib/api";
import { getProductDetailUrl } from "@/lib/slugs";

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

const sofas = [
  {
    name: "The Sovereign",
    slug: "the-sovereign",
    material: "Italian Navy Velvet",
    description:
      "Hand-tufted navy velvet with brushed gold legs. A statement of modern opulence for the discerning homeowner.",
    image: luxurySofa,
    originalPrice: "85,000",
    discountedPrice: "62,000",
    stock: 2,
    badge: "Best Seller",
  },
  {
    name: "The Midnight Royal",
    slug: "the-midnight-royal",
    material: "Deep Blue Velvet",
    description:
      "Rich deep blue velvet upholstery over a kiln-dried hardwood frame, paired with a gold-trimmed coffee table.",
    image: sofaNavy,
    originalPrice: "78,000",
    discountedPrice: "58,500",
    stock: 3,
    badge: "Limited Offer",
  },
  {
    name: "The Ivory Empress",
    slug: "the-ivory-empress",
    material: "Premium Italian Leather",
    description:
      "Cream Italian leather with nailhead detailing and gold base accents. Timeless elegance for grand living spaces.",
    image: sofaCream,
    originalPrice: "92,000",
    discountedPrice: "69,000",
    stock: 1,
    badge: "Only 1 Left",
  },
  {
    name: "The Emerald Crown",
    slug: "the-emerald-crown",
    material: "Emerald Tufted Velvet",
    description:
      "A curved emerald chesterfield with brass legs. Bold, regal, and impossible to ignore.",
    image: sofaEmerald,
    originalPrice: "75,000",
    discountedPrice: "55,000",
    stock: 3,
    badge: "New Arrival",
  },
  {
    name: "The Bordeaux Classic",
    slug: "the-bordeaux-classic",
    material: "Burgundy Velvet",
    description:
      "Deep burgundy chesterfield with button-tufted detailing and gold feet. Heritage craftsmanship meets modern luxury.",
    image: sofaBurgundy,
    originalPrice: "70,000",
    discountedPrice: "52,000",
    stock: 2,
    badge: "Hot Deal",
  },
  {
    name: "The Metropolitan",
    slug: "the-metropolitan",
    material: "Charcoal Linen Blend",
    description:
      "An L-shaped sectional in charcoal fabric with clean modern lines. Perfect for expansive contemporary living rooms.",
    image: sofaCharcoal,
    originalPrice: "98,000",
    discountedPrice: "74,500",
    stock: 2,
    badge: "Limited Offer",
  },
  {
    name: "The Sahara",
    slug: "the-sahara",
    material: "Camel Italian Leather",
    description:
      "Warm camel-toned leather with tufted back and gold legs. Mid-century sophistication for the modern connoisseur.",
    image: sofaCamel,
    originalPrice: "82,000",
    discountedPrice: "61,000",
    stock: 3,
    badge: "Popular",
  },
];

const valueProps = [
  { icon: Star, label: "Italian-Grade Fabric", desc: "Sourced from top European suppliers" },
  { icon: Sparkles, label: "Handcrafted Design", desc: "Each piece individually hand-finished" },
  { icon: Palette, label: "Customizable Options", desc: "Choose color, fabric, and size" },
  { icon: Ruler, label: "Perfect for Addis Ababa Homes", desc: "Designed for premium local interiors" },
];

function useCountdown(hours: number) {
  const endTime = useRef(Date.now() + hours * 60 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = Math.max(0, endTime.current - Date.now());
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(0, endTime.current - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

const LuxurySofas = () => {
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
          .filter((p) => p.category === "Luxury Sofas" && p.status === "Active");
        setDbProducts(mapped);
        setBackendConnected(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load sofas from backend", err);
        setBackendConnected(false);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-32 pb-16 bg-charcoal-gradient relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
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
              Each piece is a masterwork of Italian-grade materials, precision craftsmanship, and
              timeless design — curated for Addis Ababa's most distinguished interiors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-16 bg-charcoal-gradient">
          <div className="container mx-auto px-6 lg:px-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading luxury sofas...</p>
          </div>
        </section>
      )}

      {/* Backend Products (when connected) */}
      {!loading && backendConnected && dbProducts.length > 0 && (
        <section className="py-16 bg-charcoal-gradient">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="mb-10">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Available Luxury Sofas
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

      {/* Hardcoded Sofas (when backend not connected or no products) */}
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
                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {sofa.badge}
                    </div>
                    {/* Stock warning */}
                    {sofa.stock <= 2 && (
                      <div className="absolute top-3 right-3 bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Only {sofa.stock} left
                      </div>
                    )}
                    <div className="absolute inset-0 border border-primary/10 pointer-events-none group-hover:border-primary/30 transition-colors duration-300" />
                  </div>

                  <span className="font-accent text-xs tracking-[0.25em] uppercase text-primary block mb-1">
                    {sofa.material}
                  </span>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{sofa.name}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
                    {sofa.description}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="font-body text-sm text-muted-foreground line-through">
                      Was: {sofa.originalPrice} ETB
                    </span>
                    <span className="font-display text-lg font-bold text-primary flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      {sofa.discountedPrice} ETB
                    </span>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Link
                      to={`/sofa-order/${sofa.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body font-bold text-xs tracking-[0.1em] uppercase rounded-lg hover:bg-gold-light transition-all duration-300"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Order Now
                    </Link>
                    <Link
                      to={`/sofa-order/${sofa.slug}?customize=true`}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary font-body font-semibold text-xs tracking-[0.1em] uppercase rounded-lg hover:bg-primary/10 transition-all duration-300"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      Customize and Order Call 0995871152
                    </Link>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`tel:${PHONE_NUMBER}`}
                      className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-body text-xs font-semibold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </a>
                    <span className="text-border">|</span>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in the ${sofa.name} sofa. Can you give me more info?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-green-400 hover:text-green-300 font-body text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                  </div>
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
            Why Choose <span className="text-gold-gradient">Addis Majlis Glory</span>
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
              Didn't Find What You're Looking For?
            </h2>
            <p className="font-body text-muted-foreground mb-8 max-w-lg mx-auto">
              We craft bespoke pieces tailored to your vision. Call us for a private consultation.
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
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I'd like to schedule a consultation for a custom sofa.")}`}
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

export default LuxurySofas;
