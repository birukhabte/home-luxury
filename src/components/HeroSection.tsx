import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import heroImage from "@/assets/tv stand/tvmain.jpg";
import { apiGet } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Copy, Check, Phone } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [copied, setCopied] = useState(false);
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
      isProduct?: boolean;
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
      isProduct?: boolean;
    } | null
  >(null);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  const handleCallToReserve = () => {
    setShowPhoneNumber(true);
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText("0995871152");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCloseModal = () => {
    setSelectedPromo(null);
    setShowPhoneNumber(false);
    setCopied(false);
  };

  useEffect(() => {
    (async () => {
      try {
        // Fetch regular promotions
        const promoData = await apiGet<any[]>("/promotions");
        const activePromos = (promoData || [])
          .map((p) => {
            const status = p.status || (p.isActive ? "Active" : "Draft");
            if (status !== "Active") return null;

            const category = p.category || "Luxury Sofas";
            const discountFromNumber =
              p.discountPercentage !== undefined && p.discountPercentage !== null && p.discountPercentage > 0
                ? `${p.discountPercentage}%`
                : "";

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
              isProduct: false,
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
              isProduct?: boolean;
            } => !!p && !!p.name && (p.discount !== "" || (p.salePrice && p.originalPrice)),
          );

        // Fetch discounted products
        const discountedProducts = await apiGet<any[]>("/products/discounted");
        const productPromos = (discountedProducts || [])
          .map((product) => {
            if (!product.originalPrice || !product.discountPrice) return null;

            const originalNum = parseFloat(product.originalPrice.replace(/[^\d.]/g, ''));
            const discountedNum = parseFloat(product.discountPrice.replace(/[^\d.]/g, ''));
            
            let discountPercent = 0;
            if (originalNum && discountedNum && originalNum > discountedNum) {
              discountPercent = Math.round(((originalNum - discountedNum) / originalNum) * 100);
            }

            if (discountPercent === 0) return null;

            // Generate product link
            const slug = product.name.toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim();

            return {
              id: product.id || product._id || "",
              name: product.name,
              discount: `${discountPercent}%`,
              link: `/${slug}/sofa-detail`,
              imageUrl: product.imageUrl || product.imageUrls?.[0],
              expiryDate: "Limited Time",
              description: `${product.material} - Special discount on this premium ${product.category.toLowerCase()}`,
              category: product.category,
              originalPrice: product.originalPrice,
              salePrice: product.discountPrice,
              endAt: "",
              isProduct: true,
            };
          })
          .filter(Boolean);

        // Combine promotions and discounted products, prioritize products
        const allPromos = [...(productPromos as any[]), ...activePromos];
        
        if (allPromos.length > 0) {
          setHeroPromos(allPromos.slice(0, 6)); // Allow up to 6 items for scrolling
        }
      } catch {
        // fail silently in hero if APIs are down
      }
    })();
  }, []);

  // Check scroll buttons when promotions load
  useEffect(() => {
    if (heroPromos.length > 0) {
      setTimeout(checkScrollButtons, 100);
    }
  }, [heroPromos]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury TV stand with premium materials and elegant design in Addis Ababa"
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-left"
          style={{ transform: 'scale(2) translateX(-25%)' }}
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
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-body font-semibold text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:bg-gold-light hover:shadow-gold"
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
              { label: "More", href: "/products" },
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

          {/* Right: Highlighted Promotions - Single Card with Side-by-Side Layout */}
          {heroPromos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="w-full max-w-2xl lg:self-center mt-8 lg:mt-0"
            >
              <div className="bg-background/90 border border-gold-dark/60 rounded-2xl shadow-xl backdrop-blur-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[11px] font-body tracking-[0.25em] uppercase text-gold-light mb-2">
                      Limited Time Promotions
                    </p>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Exclusive Offers
                    </h3>
                  </div>
                  
                  {/* Navigation Arrows */}
                  {heroPromos.length > 2 && (
                    <div className="flex gap-2">
                      <button
                        onClick={scrollLeft}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded-full border transition-all duration-300 ${
                          canScrollLeft
                            ? 'border-primary text-primary hover:bg-primary/10'
                            : 'border-border/40 text-muted-foreground/40 cursor-not-allowed'
                        }`}
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={scrollRight}
                        disabled={!canScrollRight}
                        className={`p-2 rounded-full border transition-all duration-300 ${
                          canScrollRight
                            ? 'border-primary text-primary hover:bg-primary/10'
                            : 'border-border/40 text-muted-foreground/40 cursor-not-allowed'
                        }`}
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div 
                  ref={scrollContainerRef}
                  className="flex gap-4 overflow-x-auto pb-2"
                  onScroll={checkScrollButtons}
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    WebkitScrollbar: { display: 'none' }
                  }}
                >
                  {heroPromos.map((promo, index) => (
                    <div
                      key={promo.name + index}
                      className="flex-shrink-0 w-64 border border-border/40 rounded-xl p-4 bg-background/50 backdrop-blur-sm"
                    >
                      {promo.imageUrl && (
                        <div className="w-full h-24 rounded-lg overflow-hidden border border-border/60 mb-3">
                          <img
                            src={promo.imageUrl}
                            alt={promo.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-display text-base font-semibold text-foreground line-clamp-2">
                          {promo.name}
                        </h4>
                        {promo.isProduct && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">
                            Product
                          </span>
                        )}
                      </div>
                      
                      {promo.discount && (
                        <p className="font-body text-sm text-destructive font-semibold mb-2">
                          {promo.discount} OFF
                        </p>
                      )}
                      
                      {promo.description && (
                        <p className="font-body text-xs text-muted-foreground mb-3 line-clamp-2">
                          {promo.description}
                        </p>
                      )}
                      
                      {promo.expiryDate && (
                        <p className="font-body text-[10px] text-muted-foreground mb-3">
                          Valid until {promo.expiryDate}
                        </p>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => setSelectedPromo(promo)}
                        className="inline-flex items-center justify-center w-full px-3 py-2 rounded-md bg-primary text-primary-foreground font-body text-[10px] font-semibold tracking-[0.18em] uppercase hover:bg-gold-light transition-colors duration-300"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
                
                {heroPromos.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="font-body text-sm">
                      No active promotions at the moment
                    </p>
                    <p className="font-body text-xs mt-1">
                      Check back soon for exclusive offers
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {selectedPromo && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleCloseModal}
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
                onClick={handleCloseModal}
                aria-label="Close promotion details"
                className="ml-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedPromo.imageUrl && (
              <div className="w-full h-32 rounded-xl overflow-hidden border border-border/60 mb-4">
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
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-md border border-border text-xs font-body tracking-[0.16em] uppercase text-muted-foreground hover:bg-background/60"
                >
                  Close
                </button>
                {!showPhoneNumber ? (
                  <button
                    type="button"
                    onClick={handleCallToReserve}
                    className="px-4 py-2 rounded-md border border-gold-dark text-xs font-body tracking-[0.16em] uppercase text-foreground hover:bg-primary/10"
                  >
                    Call to Reserve
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-gold-dark bg-primary/5">
                    <Phone className="w-3 h-3 text-primary" />
                    <a
                      href="tel:0995871152"
                      className="text-primary font-body text-xs font-semibold hover:text-gold-light transition-colors"
                    >
                      0995871152
                    </a>
                    <button
                      onClick={handleCopyPhone}
                      className="ml-1 p-1 hover:bg-primary/10 rounded transition-colors"
                      title="Copy phone number"
                    >
                      {copied ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-primary" />
                      )}
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleCloseModal();
                    if (selectedPromo.isProduct) {
                      navigate(selectedPromo.link);
                    } else {
                      navigate(selectedPromo.link);
                    }
                  }}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-body tracking-[0.16em] uppercase hover:bg-gold-light"
                >
                  {selectedPromo.isProduct ? 'View Product' : 'Order Now'}
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
