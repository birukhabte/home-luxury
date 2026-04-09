import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-living-room.jpg";
import { apiGet } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [heroPromos, setHeroPromos] = useState<
    {
      id: string;
      name: string;
      discount: string;
      link: string;
      imageUrl?: string;
      expiryDate?: string;
      description?: string;
      category?: string;
      originalPrice?: string;
      salePrice?: string;
      endAt?: string;
    }[]
  >([]);
  const [selectedPromo, setSelectedPromo] = useState<
    {
      id: string;
      name: string;
      discount: string;
      link: string;
      imageUrl?: string;
      expiryDate?: string;
      description?: string;
      category?: string;
      originalPrice?: string;
      salePrice?: string;
      endAt?: string;
    } | null
  >(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<any[]>("/promotions");
        const active = (data || [])
          .map((p) => {
            const status = p.status || (p.isActive ? "Active" : "Draft");
            if (status !== "Active") return null;

            const category = p.category || "Luxury Sofas";
            const discountFromNumber =
              p.discountPercentage !== undefined && p.discountPercentage !== null && p.discountPercentage > 0
                ? `${p.discountPercentage}%`
                : "";

            // Only show discount if there's a meaningful discount value
            const discount: string = p.discount && p.discount.trim() !== "" 
              ? p.discount 
              : discountFromNumber;

            const linkFromCategory =
              category === "Arabian Majlis"
                ? "/arabian-majlis"
                : category === "Luxury TV Stands"
                ? "/luxury-tv-stands"
                : category === "Luxury Sofas"
                ? "/luxury-sofas"
                : "#collections";

            const link: string = p.link || linkFromCategory;

            const imageUrls: string[] = p.imageUrls && Array.isArray(p.imageUrls)
              ? p.imageUrls
              : p.imageUrl
              ? [p.imageUrl]
              : [];

            let expiryDate = "";
            const rawEndDate = p.endDate || p.expiryDate;
            if (rawEndDate) {
              const d = new Date(rawEndDate);
              if (!isNaN(d.getTime())) {
                expiryDate = d.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
              }
            }

            return {
              id: p.id || p._id || "",
              name: p.name || p.title || "",
              discount,
              link,
              imageUrl: imageUrls[0],
              expiryDate,
              description: p.description || "",
              category,
              originalPrice: p.originalPrice || "",
              salePrice: p.salePrice || "",
              endAt: rawEndDate,
            };
          })
          .filter(
            (p): p is {
              id: string;
              name: string;
              discount: string;
              link: string;
              imageUrl?: string;
              expiryDate?: string;
              description?: string;
              category?: string;
              originalPrice?: string;
              salePrice?: string;
              endAt?: string;
            } => !!p && !!p.name && (p.discount !== "" || (p.salePrice && p.originalPrice)),
          );

        if (active.length > 0) {
          setHeroPromos(active.slice(0, 3));
        }
      } catch {
        // fail silently in hero if promos API is down
      }
    })();
  }, []);

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
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-16 py-32">
        <div className="flex flex-col lg:flex-row items-start gap-10">
          {/* Left: Headline & CTAs */}
          <div className="max-w-2xl flex-1">
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
            transition={{ duration: 0.8, delay: 1.0 }}
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
                transition={{ duration: 0.4, delay: 1.2 + i * 0.1 }}
                className="px-5 py-2 border border-primary/30 text-sm font-body tracking-[0.1em] uppercase text-foreground/80 hover:bg-primary/10 hover:border-primary hover:text-foreground transition-all duration-300 backdrop-blur-sm bg-background/10"
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
          </div>

          {/* Right: Highlighted Promotions (up to 3 slots) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="w-full max-w-2xl lg:self-center mt-8 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {Array.from({ length: 3 }).map((_, index) => {
              const promo = heroPromos[index];
              if (promo) {
                return (
                  <div
                    key={promo.name + index}
                    className="bg-background/90 border border-gold-dark/60 rounded-2xl shadow-xl backdrop-blur-md p-5 flex flex-col justify-between gap-3 aspect-square"
                  >
                    {promo.imageUrl && (
                      <div className="w-full h-28 rounded-xl overflow-hidden border border-border/60">
                        <img
                          src={promo.imageUrl}
                          alt={promo.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <p className="text-[11px] font-body tracking-[0.25em] uppercase text-gold-light mb-2">
                      Limited Time Promotion
                    </p>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                      {promo.name}
                    </h3>
                    {promo.discount && (
                      <p className="font-body text-sm text-destructive font-semibold mb-3">
                        {promo.discount} OFF
                      </p>
                    )}
                    {promo.expiryDate && (
                      <p className="font-body text-[11px] text-muted-foreground mb-2">
                        Valid until {promo.expiryDate}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedPromo(promo)}
                      className="inline-flex items-center justify-center w-full px-4 py-2 rounded-md bg-primary text-primary-foreground font-body text-[11px] font-semibold tracking-[0.18em] uppercase hover:bg-gold-light transition-colors duration-300"
                    >
                      View Discount
                    </button>
                  </div>
                );
              }

              // Placeholder card when no promotion for this slot
              return (
                <div
                  key={`placeholder-${index}`}
                  className="border border-dashed border-gold-dark/50 rounded-2xl bg-background/60 backdrop-blur-md p-5 flex flex-col items-center justify-center text-center gap-2 text-muted-foreground aspect-square"
                >
                  <p className="text-[11px] font-body tracking-[0.25em] uppercase mb-1">
                    Promotion Slot
                  </p>
                  <h3 className="font-display text-base font-semibold">
                    Offer coming soon
                  </h3>
                  <p className="font-body text-xs max-w-[12rem]">
                    New limited-time deals will appear here.
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {selectedPromo && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedPromo(null)}
          />
          <div className="relative z-50 w-full max-w-lg rounded-2xl border border-gold-dark bg-background/95 shadow-2xl backdrop-blur-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[11px] font-body tracking-[0.25em] uppercase text-gold-light mb-1">
                  Promotion Details
                </p>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {selectedPromo.name}
                </h2>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Limited time offer on handcrafted luxury furniture in Addis Ababa.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPromo(null)}
                aria-label="Close promotion details"
                className="ml-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedPromo.imageUrl && (
              <div className="w-full h-40 rounded-xl overflow-hidden border border-border/60 mb-4">
                <img
                  src={selectedPromo.imageUrl}
                  alt={selectedPromo.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {selectedPromo.category && (
              <p className="font-body text-xs text-muted-foreground mb-1 uppercase tracking-[0.16em]">
                {selectedPromo.category}
              </p>
            )}

            {selectedPromo.description && (
              <p className="font-body text-sm text-muted-foreground mb-3">
                {selectedPromo.description}
              </p>
            )}

            {(selectedPromo.salePrice && selectedPromo.originalPrice) && (
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-display text-2xl font-bold text-primary">
                  {selectedPromo.salePrice}
                </span>
                <span className="font-body text-sm text-muted-foreground line-through">
                  {selectedPromo.originalPrice}
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-4">
              {selectedPromo.discount && (
                <span className="font-body font-semibold text-destructive">
                  {selectedPromo.discount} OFF
                </span>
              )}
              {selectedPromo.expiryDate && (
                <span className="font-body text-muted-foreground">
                  Valid until {selectedPromo.expiryDate}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
              {selectedPromo.endAt && (
                <p className="font-body text-[11px] text-muted-foreground">
                  {(() => {
                    const end = new Date(selectedPromo.endAt!);
                    const now = new Date();
                    const diffMs = end.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                    if (Number.isNaN(diffDays)) return "";
                    if (diffDays > 1) return `Offer ends in ${diffDays} days`;
                    if (diffDays === 1) return "Offer ends in 1 day";
                    if (diffDays === 0) return "Offer ends today";
                    return "Offer has ended";
                  })()}
                </p>
              )}
              <div className="flex flex-wrap justify-end gap-2 sm:ml-auto">
                <button
                  type="button"
                  onClick={() => setSelectedPromo(null)}
                  className="px-4 py-2 rounded-md border border-border text-xs font-body tracking-[0.16em] uppercase text-muted-foreground hover:bg-background/60"
                >
                  Close
                </button>
                <a
                  href="tel:0911288820"
                  className="px-4 py-2 rounded-md border border-gold-dark text-xs font-body tracking-[0.16em] uppercase text-foreground hover:bg-primary/10"
                >
                  Call to Reserve
                </a>
                <a
                  href={`https://wa.me/251911288820?text=${encodeURIComponent(
                    `I'm interested in the ${selectedPromo.name} offer (${selectedPromo.discount || ""} OFF).`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-md border border-emerald-600 text-xs font-body tracking-[0.16em] uppercase text-emerald-500 hover:bg-emerald-600/10"
                >
                  WhatsApp Expert
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPromo(null);
                    navigate(selectedPromo.link);
                  }}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-body tracking-[0.16em] uppercase hover:bg-gold-light"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
