import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tag, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { apiGet } from "@/lib/api";

interface Promo {
  id: string;
  name: string;
  originalPrice: string;
  salePrice: string;
  discount: string;
  description: string;
  imageUrls?: string[];
  category: string;
  link: string;
}

const PromotionalSection = () => {
  const [promos, setPromos] = useState<Promo[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<any[]>("/promotions");
        const normalized: Promo[] = (data || [])
          .map((p) => {
            const status = p.status || (p.isActive ? "Active" : "Draft");
            if (status !== "Active") return null;

            const category = p.category || "Luxury Sofas";
            const discountFromNumber =
              p.discountPercentage !== undefined && p.discountPercentage !== null
                ? `${p.discountPercentage}%`
                : "";

            const discount: string = p.discount || discountFromNumber || "";

            const link: string =
              p.link || (category === "Arabian Majlis" ? "/arabian-majlis" : "/luxury-sofas");

            const imageUrls: string[] = p.imageUrls && Array.isArray(p.imageUrls)
              ? p.imageUrls
              : p.imageUrl
              ? [p.imageUrl]
              : [];

            return {
              id: p.id || p._id || "",
              name: p.name || p.title || "",
              originalPrice: p.originalPrice || "",
              salePrice: p.salePrice || "",
              discount,
              description: p.description || "",
              imageUrls,
              category,
              link,
            } as Promo;
          })
          .filter((p): p is Promo => p !== null);

        setPromos(normalized);
      } catch (err) {
        console.error("Failed to load promotions for homepage", err);
      }
    })();
  }, []);

  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-burgundy rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-full mb-6">
            <Tag className="w-4 h-4 text-destructive" />
            <span className="font-body text-xs tracking-[0.2em] uppercase text-destructive font-semibold">
              Limited Time Offer
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Exclusive <span className="text-primary">Promotions</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            Unmatched luxury at exceptional prices — don't miss these handpicked deals.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-body text-sm">Offers valid while stocks last</span>
          </div>
        </motion.div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {promos.map((promo, index) => (
            <motion.div
              key={promo.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card border border-border rounded-sm overflow-hidden hover:border-primary/30 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={promo.imageUrls && promo.imageUrls.length > 0 ? promo.imageUrls[0] : undefined}
                  alt={promo.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1.5 font-body font-bold text-sm tracking-wide">
                  {promo.discount} OFF
                </div>
                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm text-foreground px-3 py-1 font-body text-xs tracking-[0.1em] uppercase">
                  {promo.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {promo.name}
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">
                  {promo.description}
                </p>

                {/* Pricing */}
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-display text-2xl font-bold text-primary">
                    {promo.salePrice}
                  </span>
                  <span className="font-body text-sm text-muted-foreground line-through">
                    {promo.originalPrice}
                  </span>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-3">
                  <a
                    href="tel:0911288820"
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:bg-gold-light"
                  >
                    Claim This Deal
                  </a>
                  <Link
                    to={promo.link}
                    className="inline-flex items-center justify-center w-11 h-11 border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalSection;
