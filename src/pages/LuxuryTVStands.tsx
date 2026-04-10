import { motion } from "framer-motion";
import { Phone, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  price: string;
  originalPrice?: string;
  discountPrice?: string;
  status: string;
  imageUrl?: string;
  imageUrls?: string[];
}

const tvStands = [
  {
    name: "The Imperial Console",
    material: "Walnut & Brass",
    description: "Premium walnut wood with brass inlay details and soft-close drawers. A centerpiece for your entertainment space.",
    features: ["Soft-close drawers", "Cable management system", "Tempered glass shelves"],
    image: tvMain,
  },
  {
    name: "The Monarch Stand",
    material: "Oak & Gold Accents",
    description: "Solid oak construction with gold-plated handles and integrated LED lighting. Modern luxury meets functionality.",
    features: ["Integrated LED lighting", "Adjustable shelving", "Premium oak finish"],
    image: tv2,
  },
  {
    name: "The Prestige Unit",
    material: "Marble & Steel",
    description: "Italian marble top with brushed steel frame. Contemporary elegance for the modern home.",
    features: ["Italian marble surface", "Steel frame construction", "Open and closed storage"],
    image: tv3,
  },
  {
    name: "The Regal Cabinet",
    material: "Mahogany & Bronze",
    description: "Rich mahogany wood with bronze hardware and hand-carved details. Timeless sophistication.",
    features: ["Hand-carved details", "Bronze hardware", "Multiple compartments"],
    image: tv4,
  },
  {
    name: "The Executive Media Center",
    material: "Ebony & Chrome",
    description: "Sleek ebony finish with chrome accents and floating design. Perfect for contemporary interiors.",
    features: ["Floating wall mount option", "Chrome accents", "Hidden cable channels"],
    image: tv5,
  },
  {
    name: "The Grand Entertainment Unit",
    material: "Teak & Gold Leaf",
    description: "Expansive teak wood unit with gold leaf detailing. Designed for large living spaces and home theaters.",
    features: ["Extra-wide design", "Gold leaf accents", "Soundbar integration"],
    image: tv6,
  },
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
                        <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1.5 font-body font-bold text-sm tracking-wide">
                          SALE
                        </div>
                      )}
                      <div className="absolute inset-0 border border-primary/10 pointer-events-none group-hover:border-primary/30 transition-colors duration-300" />
                    </div>
                    <span className="font-accent text-xs tracking-[0.25em] uppercase text-primary block mb-1">
                      {product.material}
                    </span>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      {product.name}
                    </h3>
                    {/* Show discount pricing if available, otherwise show regular price */}
                    {product.discountPrice && product.originalPrice ? (
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="font-display text-lg font-bold text-primary">
                          {product.discountPrice}
                        </span>
                        <span className="font-body text-sm text-muted-foreground line-through">
                          {product.originalPrice}
                        </span>
                      </div>
                    ) : product.price ? (
                      <p className="font-body text-sm text-muted-foreground mb-4">{product.price}</p>
                    ) : null}
                    <span className="inline-flex items-center gap-1.5 text-primary hover:text-gold-light transition-colors font-body text-sm font-semibold tracking-[0.1em] uppercase">
                      <Phone className="w-3.5 h-3.5" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tvStands.map((stand, index) => (
                <motion.div
                  key={stand.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
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
                    <div className="absolute inset-0 border border-primary/10 pointer-events-none group-hover:border-primary/30 transition-colors duration-300" />
                  </div>
                  <span className="font-accent text-xs tracking-[0.25em] uppercase text-primary block mb-1">
                    {stand.material}
                  </span>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {stand.name}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
                    {stand.description}
                  </p>
                  <ul className="space-y-1 mb-4">
                    {stand.features.map((feature) => (
                      <li key={feature} className="font-body text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
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
      )}

      {/* CTA */}
      <section className="py-16 bg-charcoal-gradient border-t border-border">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Custom Designs Available
            </h2>
            <p className="font-body text-muted-foreground mb-8 max-w-lg mx-auto">
              Need a specific size or finish? We create bespoke TV stands tailored to your space and style preferences.
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

export default LuxuryTVStands;