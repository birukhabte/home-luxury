import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tag, Clock, ArrowRight, Percent, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiGet } from "@/lib/api";
import { generateProductSlug } from "@/lib/slugs";

interface Product {
  id: string;
  name: string;
  category: string;
  material: string;
  description?: string;
  price: string;
  originalPrice?: string;
  discountPrice?: string;
  status: string;
  imageUrl?: string;
  imageUrls?: string[];
}

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
  expiryDate?: string;
}

const PromotionsPage = () => {
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch discounted products
        const productsData = await apiGet<Product[]>("/products/discounted");
        setDiscountedProducts(productsData || []);

        // Fetch promotions
        const promosData = await apiGet<any[]>("/promotions");
        const activePromos: Promo[] = (promosData || [])
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

            return {
              id: p.id || p._id || "",
              name: p.name || p.title || "",
              category,
              originalPrice: p.originalPrice || "",
              salePrice: p.salePrice || "",
              discount,
              description: p.description || "",
              imageUrls: p.imageUrls || (p.imageUrl ? [p.imageUrl] : []),
              link,
              expiryDate: p.endDate || p.expiryDate || "",
            };
          })
          .filter(Boolean) as Promo[];

        setPromotions(activePromos);
      } catch (error) {
        console.error("Error fetching promotions data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateDiscount = (original: string, discounted: string) => {
    const originalNum = parseFloat(original.replace(/[^\d.]/g, ''));
    const discountedNum = parseFloat(discounted.replace(/[^\d.]/g, ''));
    if (originalNum && discountedNum && originalNum > discountedNum) {
      return Math.round(((originalNum - discountedNum) / originalNum) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Loading promotions...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      {/* Hero Section with Discounted Products */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Special <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Offers</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our exclusive collection of discounted luxury furniture. Limited time offers on premium sofas, majlis sets, and TV stands.
            </p>
          </motion.div>

          {/* Discounted Products Hero Grid */}
          {discountedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-20"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Percent className="text-purple-400" />
                  Products on Sale
                </h2>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 px-4 py-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Limited Time
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {discountedProducts.slice(0, 6).map((product) => {
                  const discountPercent = product.originalPrice && product.discountPrice 
                    ? calculateDiscount(product.originalPrice, product.discountPrice)
                    : 0;
                  
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      className="group"
                    >
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300">
                        <div className="relative">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-64 object-cover"
                            />
                          )}
                          {discountPercent > 0 && (
                            <Badge className="absolute top-4 right-4 bg-red-500 text-white border-0">
                              -{discountPercent}%
                            </Badge>
                          )}
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-purple-500/80 text-white border-0">
                              <Star className="w-3 h-3 mr-1" />
                              Sale
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                          <p className="text-gray-300 text-sm mb-4">{product.material}</p>
                          
                          <div className="flex items-center gap-3 mb-4">
                            {product.originalPrice && (
                              <span className="text-gray-400 line-through text-lg">
                                {product.originalPrice}
                              </span>
                            )}
                            <span className="text-purple-400 font-bold text-xl">
                              {product.discountPrice || product.price}
                            </span>
                          </div>
                          
                          <Link to={`/${generateProductSlug(product.name)}/sofa-detail`}>
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                              View Details
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Regular Promotions Section */}
      {promotions.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Promotions</span>
              </h2>
              <p className="text-gray-300 text-lg">
                Exclusive deals and seasonal offers on our premium furniture collections
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {promotions.map((promo, index) => (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300">
                    <div className="relative">
                      {promo.imageUrls?.[0] && (
                        <img
                          src={promo.imageUrls[0]}
                          alt={promo.name}
                          className="w-full h-64 object-cover"
                        />
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                          <Tag className="w-3 h-3 mr-1" />
                          {promo.discount}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{promo.name}</h3>
                      <p className="text-gray-300 mb-4">{promo.description}</p>
                      
                      <div className="flex items-center gap-3 mb-6">
                        {promo.originalPrice && (
                          <span className="text-gray-400 line-through text-lg">
                            {promo.originalPrice}
                          </span>
                        )}
                        <span className="text-purple-400 font-bold text-2xl">
                          {promo.salePrice}
                        </span>
                      </div>
                      
                      <Link to={promo.link}>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                          Shop Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default PromotionsPage;