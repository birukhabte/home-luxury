import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Phone } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiGet } from "@/lib/api";
import { getProductDetailUrl } from "@/lib/slugs";

// Import demo product images
import luxurySofa from "@/assets/luxury-sofa.jpg";
import sofaNavy from "@/assets/sofa-navy-velvet.jpg";
import sofaCream from "@/assets/sofa-cream-leather.jpg";
import sofaEmerald from "@/assets/sofa-emerald.jpg";
import arabianMajlis from "@/assets/arabian-majlis.jpg";
import majlisBurgundyGold from "@/assets/majlis-burgundy-gold.jpg";
import majlisRoyalBlue from "@/assets/majlis-royal-blue.jpg";
import tvMain from "@/assets/tv stand/tvmain.jpg";
import tv2 from "@/assets/tv stand/tv2.jpg";
import tv3 from "@/assets/tv stand/tv3.jpg";

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
  imageColor?: string;
  imageUrls?: string[];
  imageColors?: string[];
}

// Demo products from all categories
const demoProducts = [
  // Luxury Sofas
  {
    id: "demo-1",
    name: "The Sovereign",
    category: "Luxury Sofas" as Category,
    material: "Italian Navy Velvet",
    price: "From 62,000 ETB",
    originalPrice: "85,000 ETB",
    discountPrice: "62,000 ETB",
    status: "Active",
    imageUrl: luxurySofa,
    imageUrls: [luxurySofa],
  },
  {
    id: "demo-2",
    name: "The Midnight Royal",
    category: "Luxury Sofas" as Category,
    material: "Deep Blue Velvet",
    price: "From 58,500 ETB",
    originalPrice: "78,000 ETB",
    discountPrice: "58,500 ETB",
    status: "Active",
    imageUrl: sofaNavy,
    imageUrls: [sofaNavy],
  },
  {
    id: "demo-3",
    name: "The Ivory Empress",
    category: "Luxury Sofas" as Category,
    material: "Premium Italian Leather",
    price: "From 69,000 ETB",
    originalPrice: "92,000 ETB",
    discountPrice: "69,000 ETB",
    status: "Active",
    imageUrl: sofaCream,
    imageUrls: [sofaCream],
  },
  {
    id: "demo-4",
    name: "The Emerald Crown",
    category: "Luxury Sofas" as Category,
    material: "Emerald Tufted Velvet",
    price: "From 55,000 ETB",
    originalPrice: "75,000 ETB",
    discountPrice: "55,000 ETB",
    status: "Active",
    imageUrl: sofaEmerald,
    imageUrls: [sofaEmerald],
  },
  // Arabian Majlis
  {
    id: "demo-5",
    name: "The Grand Heritage",
    category: "Arabian Majlis" as Category,
    material: "Burgundy & Gold Brocade",
    price: "From 88,000 ETB",
    originalPrice: "120,000 ETB",
    discountPrice: "88,000 ETB",
    status: "Active",
    imageUrl: arabianMajlis,
    imageUrls: [arabianMajlis],
  },
  {
    id: "demo-6",
    name: "The Royal Palace",
    category: "Arabian Majlis" as Category,
    material: "Classic Burgundy & Gold",
    price: "From 79,000 ETB",
    originalPrice: "105,000 ETB",
    discountPrice: "79,000 ETB",
    status: "Active",
    imageUrl: majlisBurgundyGold,
    imageUrls: [majlisBurgundyGold],
  },
  {
    id: "demo-7",
    name: "The Azure Majesty",
    category: "Arabian Majlis" as Category,
    material: "Royal Blue & Silver",
    price: "From 85,000 ETB",
    originalPrice: "115,000 ETB",
    discountPrice: "85,000 ETB",
    status: "Active",
    imageUrl: majlisRoyalBlue,
    imageUrls: [majlisRoyalBlue],
  },
  // TV Stands
  {
    id: "demo-8",
    name: "The Imperial Console",
    category: "Luxury TV Stands" as Category,
    material: "Walnut & Brass",
    price: "Contact for pricing",
    status: "Active",
    imageUrl: tvMain,
    imageUrls: [tvMain],
  },
  {
    id: "demo-9",
    name: "The Monarch Stand",
    category: "Luxury TV Stands" as Category,
    material: "Oak & Gold Accents",
    price: "Contact for pricing",
    status: "Active",
    imageUrl: tv2,
    imageUrls: [tv2],
  },
  {
    id: "demo-10",
    name: "The Prestige Unit",
    category: "Luxury TV Stands" as Category,
    material: "Marble & Steel",
    price: "Contact for pricing",
    status: "Active",
    imageUrl: tv3,
    imageUrls: [tv3],
  },
];

const AllProducts = () => {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [backendConnected, setBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [searchParams] = useSearchParams();
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
            imageColor: p.imageColor,
            imageUrls: p.imageUrls || [],
            imageColors: p.imageColors || [],
          }))
          .filter((p) => p.status === "Active");
        setDbProducts(mapped);
        setBackendConnected(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products from backend", err);
        setBackendConnected(false);
        setLoading(false);
      });
  }, []);

  // Handle URL parameters
  useEffect(() => {
    const category = searchParams.get("category");
    if (category && ["Luxury Sofas", "Arabian Majlis", "Luxury TV Stands"].includes(category)) {
      setSelectedCategory(category as Category);
    }
  }, [searchParams]);

  const productsToShow = backendConnected ? dbProducts : demoProducts;
  
  // Apply filters based on URL parameters
  let filteredProducts = selectedCategory === "All" 
    ? productsToShow 
    : productsToShow.filter(p => p.category === selectedCategory);

  // Apply search filter
  const searchQuery = searchParams.get("search");
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.material.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const categories: (Category | "All")[] = ["All", "Luxury Sofas", "Arabian Majlis", "Luxury TV Stands"];

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
              Our Complete Collection
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
              All <span className="text-gold-gradient">Products</span>
            </h1>
            <p className="font-body text-muted-foreground text-lg max-w-2xl">
              Discover our complete range of luxury furniture — from handcrafted sofas to authentic Arabian Majlis and premium TV stands.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-charcoal-gradient border-b border-border/40">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-body text-sm tracking-[0.1em] uppercase transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "border border-primary/30 text-foreground/80 hover:bg-primary/10 hover:border-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-16 bg-charcoal-gradient">
          <div className="container mx-auto px-6 lg:px-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </section>
      )}

      {/* Products Grid */}
      {!loading && (
        <section className="py-16 bg-charcoal-gradient">
          <div className="container mx-auto px-6 lg:px-16">
            {!backendConnected && (
              <div className="mb-10 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Backend not connected. Showing demo collection.
                </p>
              </div>
            )}
            
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                {searchQuery ? `Search Results for "${searchQuery}"` : 
                 selectedCategory === "All" ? "All Products" : selectedCategory}
              </h2>
              <p className="font-body text-sm text-muted-foreground">
                {backendConnected 
                  ? "Premium collection managed from our admin panel" 
                  : "Demo collection showcasing our product range"
                } ({filteredProducts.length} items)
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => {
                  const img = product.imageUrl || (product.imageUrls && product.imageUrls[0]);
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
                            width={400}
                            height={400}
                            loading="lazy"
                            className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full aspect-square bg-muted/20 border border-border flex items-center justify-center text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                        
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          {product.category.replace("Luxury ", "")}
                        </div>
                        
                        {/* Discount Badge */}
                        {product.discountPrice && product.originalPrice && (
                          <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-2 py-1 font-body font-bold text-[10px] tracking-wide rounded">
                            SALE
                          </div>
                        )}
                        
                        <div className="absolute inset-0 border border-primary/10 pointer-events-none group-hover:border-primary/30 transition-colors duration-300" />
                      </div>
                      
                      <span className="font-accent text-xs tracking-[0.25em] uppercase text-primary block mb-1">
                        {product.material}
                      </span>
                      <h3 className="font-display text-lg font-bold text-foreground mb-2">
                        {product.name}
                      </h3>
                      
                      {/* Pricing */}
                      {product.discountPrice && product.originalPrice ? (
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="font-display text-base font-bold text-primary">
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
            ) : (
              <div className="text-center py-16">
                <p className="font-body text-muted-foreground text-lg mb-4">
                  No products found in {selectedCategory === "All" ? "any category" : selectedCategory}
                </p>
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm tracking-[0.1em] uppercase transition-all duration-300 hover:bg-gold-light"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-charcoal-gradient border-t border-border">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Need Something Custom?
            </h2>
            <p className="font-body text-muted-foreground mb-8 max-w-lg mx-auto">
              We create bespoke furniture tailored to your exact specifications and space requirements.
            </p>
            <a
              href="tel:0995871152"
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

export default AllProducts;// Commit 50 - 2024-05-25 23:10:00
// Commit 26 - 2024-05-10 11:44:00
