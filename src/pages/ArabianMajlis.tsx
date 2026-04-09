import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, ArrowLeft, X, MessageCircle, Clock, Flame, CheckCircle2,
  ChevronLeft, ChevronRight, Star, Palette, Ruler, Sparkles, ShoppingBag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
import { getProductDetailUrl } from "@/lib/slugs";

type Category = "Luxury Sofas" | "Arabian Majlis" | "Luxury TV Stands";
interface Product {
  id: string; name: string; category: Category; material: string;
  price: string; originalPrice?: string; discountPrice?: string; status: string; imageUrl?: string; imageUrls?: string[];
}

const WA = "251911288820";
const TEL = "0911288820";

const majlisCollection = [
  { name: "The Grand Heritage", slug: "grand-heritage", style: "Burgundy & Gold Brocade", description: "A regal masterpiece in rich burgundy and gold — hand-woven brocade fabric with ornate bolster cushions, perfect for grand cultural gatherings.", image: arabianMajlis, originalPrice: "120,000", discountedPrice: "88,000", stock: 2, badge: "Flagship" },
  { name: "The Royal Palace", slug: "royal-palace", style: "Classic Burgundy & Gold", description: "Lavish floor-level seating adorned with intricate gold threading on burgundy damask. A throne room for your home.", image: majlisBurgundyGold, originalPrice: "105,000", discountedPrice: "79,000", stock: 3, badge: "Best Seller" },
  { name: "The Azure Majesty", slug: "azure-majesty", style: "Royal Blue & Silver", description: "Stunning royal blue silk with silver geometric patterns. A breathtaking statement of opulence inspired by Ottoman grandeur.", image: majlisRoyalBlue, originalPrice: "115,000", discountedPrice: "85,000", stock: 2, badge: "Hot Deal" },
  { name: "The Golden Oasis", slug: "golden-oasis", style: "Cream & Gold Silk", description: "Elegant cream silk seating with gold filigree accents and burgundy accent cushions. Refined luxury for sophisticated gatherings.", image: majlisCreamGold, originalPrice: "98,000", discountedPrice: "72,000", stock: 3, badge: "Limited Offer" },
  { name: "The Emerald Sanctuary", slug: "emerald-sanctuary", style: "Emerald & Gold Velvet", description: "Rich emerald velvet with gold damask patterns. A majestic gathering space that channels centuries of Arabian hospitality tradition.", image: majlisEmerald, originalPrice: "110,000", discountedPrice: "82,000", stock: 1, badge: "Only 1 Left" },
  { name: "The Amethyst Throne", slug: "amethyst-throne", style: "Purple & Gold Velvet", description: "Deep purple tufted velvet with ornate gold cushions. Dramatic, bold, and unmistakably royal — for those who command attention.", image: majlisPurple, originalPrice: "108,000", discountedPrice: "80,000", stock: 2, badge: "New Arrival" },
  { name: "The Desert King", slug: "desert-king", style: "Brown Leather & Bronze", description: "Premium leather floor seating in warm earth tones with bronze accents. A perfect blend of Arabian tradition and contemporary comfort.", image: majlisBrownBronze, originalPrice: "95,000", discountedPrice: "70,000", stock: 3, badge: "Popular" },
];

const valueProps = [
  { icon: Star, label: "Authentic Arabian Design", desc: "Centuries of tradition crafted in" },
  { icon: Sparkles, label: "Handcrafted Brocade", desc: "Rich fabrics, individually finished" },
  { icon: Palette, label: "Fully Customizable", desc: "Colors, size, fabric of your choice" },
  { icon: Ruler, label: "Perfect for Addis Ababa", desc: "Designed for Ethiopian luxury homes" },
];

function useCountdown(hours: number) {
  const endTime = useRef(Date.now() + hours * 60 * 60 * 1000);
  const [t, setT] = useState(() => {
    const d = Math.max(0, endTime.current - Date.now());
    return { h: Math.floor(d / 3600000), m: Math.floor((d % 3600000) / 60000), s: Math.floor((d % 60000) / 1000) };
  });
  useEffect(() => {
    const iv = setInterval(() => {
      const d = Math.max(0, endTime.current - Date.now());
      setT({ h: Math.floor(d / 3600000), m: Math.floor((d % 3600000) / 60000), s: Math.floor((d % 60000) / 1000) });
    }, 1000);
    return () => clearInterval(iv);
  }, []);
  return t;
}

function pad(n: number) { return String(n).padStart(2, "0"); }

const ArabianMajlis = () => {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiGet<any[]>("/products").then((data) => {
      setDbProducts(data.map((p: any) => ({ id: p.id || p._id, name: p.name, category: p.category, material: p.material, price: p.price, originalPrice: p.originalPrice, discountPrice: p.discountPrice, status: p.status, imageUrl: p.imageUrl, imageUrls: p.imageUrls || [] })).filter((p) => p.category === "Arabian Majlis" && p.status === "Active"));
    }).catch(err => console.error("Failed to load majlis products from backend", err));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-16 bg-charcoal-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm mb-8"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="font-accent text-base tracking-[0.3em] uppercase text-primary mb-4 block">Our Collection</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">Arabian <span className="text-gold-gradient">Majlis</span></h1>
            <p className="font-body text-muted-foreground text-lg max-w-2xl">A celebration of centuries-old gathering traditions — rich brocade, silk, and velvet transformed into regal sanctuaries for your home.</p>
          </motion.div>
        </div>
      </section>

      {dbProducts.length > 0 && (
        <section className="py-16 bg-charcoal-gradient border-b border-border/40">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="mb-10"><h2 className="font-display text-2xl font-bold text-foreground mb-2">Available Majlis Sets</h2><p className="font-body text-sm text-muted-foreground max-w-xl">These Majlis sets are managed from the admin panel and reflect your live catalog.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dbProducts.map((product) => {
                const img = product.imageUrl || product.imageUrls?.[0];
                return (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="group cursor-pointer" onClick={() => navigate(getProductDetailUrl(product.name))}>
                    <div className="relative overflow-hidden mb-5">
                      {img ? <img src={img} alt={product.name} width={768} height={768} loading="lazy" className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="w-full aspect-square bg-muted/20 border border-border flex items-center justify-center text-xs text-muted-foreground">No image</div>}
                      {/* Only show Limited Offer badge if there's a discount */}
                      {product.discountPrice && product.originalPrice && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1"><Flame className="w-3 h-3" /> Limited Offer</div>
                      )}
                      <div className="absolute inset-0 border border-primary/10 pointer-events-none group-hover:border-primary/30 transition-colors duration-300" />
                    </div>
                    <span className="font-accent text-xs tracking-[0.25em] uppercase text-primary block mb-1">{product.material}</span>
                    <h3 className="font-display text-xl font-bold text-foreground mb-1">{product.name}</h3>
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
                    <span className="inline-flex items-center gap-1.5 text-primary hover:text-gold-light transition-colors font-body text-sm font-semibold tracking-[0.1em] uppercase"><ShoppingBag className="w-3.5 h-3.5" /> View Details →</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-charcoal-gradient">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {majlisCollection.map((item, index) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group">
                <div className="relative overflow-hidden mb-5">
                  <img src={item.image} alt={`${item.name} - ${item.style} Arabian Majlis Addis Ababa`} width={768} height={768} loading="lazy" className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{item.badge}</div>
                  {item.stock <= 2 && <div className="absolute top-3 right-3 bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Only {item.stock} left</div>}
                  <div className="absolute inset-0 border border-primary/10 pointer-events-none group-hover:border-primary/30 transition-colors duration-300" />
                </div>
                <span className="font-accent text-xs tracking-[0.25em] uppercase text-primary block mb-1">{item.style}</span>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{item.name}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">{item.description}</p>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-body text-sm text-muted-foreground line-through">Was: {item.originalPrice} ETB</span>
                  <span className="font-display text-lg font-bold text-primary flex items-center gap-1"><Flame className="w-4 h-4" /> {item.discountedPrice} ETB</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <a href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I'd like to order the ${item.name} (${item.style}) Majlis set. Please confirm availability.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body font-bold text-xs tracking-[0.1em] uppercase rounded-lg hover:bg-gold-light transition-all">
                    <ShoppingBag className="w-3.5 h-3.5" /> Order Now
                  </a>
                  <a href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I'd like to customize the ${item.name} Majlis. Can we discuss colors and fabric options?`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary font-body font-semibold text-xs tracking-[0.1em] uppercase rounded-lg hover:bg-primary/10 transition-all">
                    <Palette className="w-3.5 h-3.5" /> Customize & Order
                  </a>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${TEL}`} className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-body text-xs font-semibold transition-colors"><Phone className="w-3.5 h-3.5" /> Call</a>
                  <span className="text-border">|</span>
                  <a href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I'm interested in the ${item.name} Majlis. Can you tell me more?`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-green-400 hover:text-green-300 font-body text-xs font-semibold transition-colors"><MessageCircle className="w-3.5 h-3.5" /> WhatsApp</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-charcoal-gradient border-t border-border/40">
        <div className="container mx-auto px-6 lg:px-16">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">What Makes Our <span className="text-gold-gradient">Majlis</span> Special</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {valueProps.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="text-center">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 border border-primary/20 mb-3"><Icon className="w-6 h-6 text-primary" /></div>
                <h3 className="font-body text-sm font-bold text-foreground mb-1">{label}</h3>
                <p className="font-body text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-charcoal-gradient border-t border-border">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Design Your Perfect Majlis</h2>
            <p className="font-body text-muted-foreground mb-8 max-w-lg mx-auto">Every Majlis is custom-crafted to your space, fabric preferences, and cultural vision. Let us bring your dream to life.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={`tel:${TEL}`} className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-body font-bold text-sm tracking-[0.2em] uppercase transition-all hover:bg-gold-light hover:shadow-gold">
                <Phone className="w-4 h-4" /> Schedule Consultation
              </a>
              <a href={`https://wa.me/${WA}?text=${encodeURIComponent("Hello! I'd like to design a custom Majlis for my home. Can we discuss options?")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-10 py-5 bg-green-600 text-white font-body font-bold text-sm tracking-[0.2em] uppercase transition-all hover:bg-green-500">
                <MessageCircle className="w-4 h-4" /> WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArabianMajlis;
