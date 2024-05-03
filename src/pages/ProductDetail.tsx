import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  Clock, 
  Flame, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Palette,
  User,
  Mail,
  MapPin,
  Copy,
  Check,
  ShoppingCart
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

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

const PHONE_NUMBER = "0995871152";

const valueProps = [
  { icon: CheckCircle2, label: "Premium Materials" },
  { icon: CheckCircle2, label: "Handcrafted Quality" },
  { icon: CheckCircle2, label: "10-Year Warranty" },
  { icon: CheckCircle2, label: "Free Shipping in Addis Ababa" },
  { icon: CheckCircle2, label: "24-Hour Delivery" },
];

function useCountdown(hours: number) {
  const endTime = Date.now() + hours * 60 * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = Math.max(0, endTime - Date.now());
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.max(0, endTime - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
}

const ProductDetail = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Get all images (primary + additional)
  const allImages = product ? [
    ...(product.imageUrl ? [product.imageUrl] : []),
    ...(product.imageUrls?.filter((u) => u !== product.imageUrl) ?? []),
  ].filter(Boolean) : [];

  // Get all colors (matching the exact image order)
  const allColors = product ? (() => {
    const colors: string[] = [];
    
    // If we have a primary image, add its color (or empty string)
    if (product.imageUrl) {
      colors.push(product.imageColor || "");
    }
    
    // Add colors for additional images
    if (product.imageUrls) {
      const additionalImages = product.imageUrls.filter((u) => u !== product.imageUrl);
      additionalImages.forEach((_, index) => {
        colors.push(product.imageColors?.[index] || "");
      });
    }
    
    return colors;
  })() : [];

  // Get current color based on selected image
  const getCurrentColor = () => {
    console.log('Current image index:', currentImageIndex);
    console.log('All images:', allImages);
    console.log('All colors:', allColors);
    console.log('Product imageColor:', product?.imageColor);
    console.log('Product imageColors:', product?.imageColors);
    
    if (allColors.length > currentImageIndex && allColors[currentImageIndex]) {
      console.log('Selected color:', allColors[currentImageIndex]);
      return allColors[currentImageIndex];
    }
    return null;
  };

  const { h, m, s } = useCountdown(47);

  useEffect(() => {
    if (!productSlug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const products = await apiGet<any[]>("/products");
        
        // Find product by slug (convert name to slug format)
        const foundProduct = products.find((p: any) => {
          const slug = p.name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
          return slug === productSlug && p.status === "Active";
        });

        if (foundProduct) {
          console.log('Found product from backend:', foundProduct);
          setProduct({
            id: foundProduct.id || foundProduct._id,
            name: foundProduct.name,
            category: foundProduct.category,
            material: foundProduct.material,
            description: foundProduct.description,
            price: foundProduct.price,
            originalPrice: foundProduct.originalPrice,
            discountPrice: foundProduct.discountPrice,
            status: foundProduct.status,
            imageUrl: foundProduct.imageUrl,
            imageColor: foundProduct.imageColor,
            imageUrls: foundProduct.imageUrls || [],
            imageColors: foundProduct.imageColors || [],
          });
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Failed to load product", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  const handleOrder = () => {
    // Scroll to customer details form
    const formElement = document.getElementById('customer-details-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCallToReserve = () => {
    setShowPhoneNumber(true);
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(PHONE_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
      imageUrl: product.imageUrl,
      category: product.category,
      material: product.material,
      selectedColor: getCurrentColor() || undefined,
    }, quantity);
    
    toast.success(`Added ${quantity} ${product.name} to cart!`);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !customerDetails.name || !customerDetails.phone) {
      return;
    }

    // Calculate total amount
    const price = product.discountPrice || product.price;
    const totalAmount = price;

    // Navigate to payment page with order details
    const params = new URLSearchParams({
      productName: product.name,
      productPrice: price,
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      customerPhone: customerDetails.phone,
      customerAddress: customerDetails.address,
      quantity: quantity.toString(),
      totalAmount: totalAmount,
    });

    navigate(`/payment?${params.toString()}`);
  };

  const getCategoryPath = (category: Category) => {
    switch (category) {
      case "Luxury Sofas":
        return "/luxury-sofas";
      case "Arabian Majlis":
        return "/arabian-majlis";
      case "Luxury TV Stands":
        return "/luxury-tv-stands";
      default:
        return "/";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm tracking-[0.1em] uppercase transition-all duration-300 hover:bg-gold-light"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Product Detail */}
      <section className="pt-32 pb-16 bg-charcoal-gradient">
        <div className="container mx-auto px-6 lg:px-16">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              to={getCategoryPath(product.category)}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {product.category}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {allImages.length > 0 && (
                <>
                  {/* Main Image */}
                  <div className="relative aspect-square overflow-hidden rounded-lg border border-border">
                    <img
                      src={allImages[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Discount Badge */}
                    {product.discountPrice && product.originalPrice && (
                      <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1.5 font-body font-bold text-sm tracking-wide rounded">
                        <Flame className="w-3 h-3 inline mr-1" />
                        Limited Offer
                      </div>
                    )}

                    {/* Navigation Arrows */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex((i) => (i - 1 + allImages.length) % allImages.length)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((i) => (i + 1) % allImages.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden transition-colors ${
                            index === currentImageIndex ? "border-primary" : "border-border"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} view ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                
                {/* Color Display */}
                {getCurrentColor() && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-accent text-sm tracking-[0.2em] uppercase text-primary">
                      Color:
                    </span>
                    <span className="font-body text-sm text-foreground bg-primary/10 px-3 py-1 rounded-full border border-primary/30">
                      {getCurrentColor()}
                    </span>
                  </div>
                )}
                
                {product.description ? (
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                ) : (
                  <p className="font-body text-muted-foreground">
                    Premium {product.category.toLowerCase()} crafted with the finest materials and attention to detail.
                  </p>
                )}
              </div>

              {/* Urgency Elements - Only show if there's a discount */}
              {product.discountPrice && product.originalPrice && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-body font-semibold text-amber-300 uppercase tracking-wide">Only 2 left</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1.5">
                    <Clock className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-body font-semibold text-red-300">
                      Ends in {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              )}

              {/* Pricing */}
              {product.discountPrice && product.originalPrice ? (
                <div className="flex items-baseline gap-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <div>
                    <p className="text-sm font-body text-muted-foreground uppercase tracking-wider mb-1">Was</p>
                    <p className="font-body text-xl text-muted-foreground line-through">{product.originalPrice}</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <Flame className="w-5 h-5 text-primary self-center" />
                    <div>
                      <p className="text-sm font-body text-primary uppercase tracking-wider mb-1">Now</p>
                      <p className="font-display text-3xl font-bold text-primary">{product.discountPrice}</p>
                    </div>
                  </div>
                </div>
              ) : product.price ? (
                <div className="p-4 bg-muted/10 border border-border rounded-xl">
                  <p className="text-sm font-body text-muted-foreground uppercase tracking-wider mb-1">Price</p>
                  <p className="font-display text-3xl font-bold text-foreground">{product.price}</p>
                </div>
              ) : null}

              {/* Value Props */}
              <div className="grid grid-cols-2 gap-3">
                {valueProps.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-body text-sm text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>

              {/* Shipping Information */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Free Shipping in Addis Ababa</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-11">
                  Get your luxury furniture delivered within 24 hours at no extra cost within Addis Ababa city limits.
                </p>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-body font-bold text-sm tracking-[0.15em] uppercase rounded-xl hover:bg-gold-light transition-all duration-300 shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleOrder}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 border border-primary text-primary font-body font-semibold text-sm tracking-[0.1em] uppercase rounded-xl hover:bg-primary/10 transition-all duration-300"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Buy Now
                </button>
                <button
                  onClick={handleOrder}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 border border-border text-muted-foreground font-body font-semibold text-sm tracking-[0.1em] uppercase rounded-xl hover:bg-primary/10 transition-all duration-300"
                >
                  <Palette className="w-5 h-5" />
                  Customize and Order Call 0995871152
                </button>
              </div>

              {/* Contact Options */}
              <div className="border-t border-border/40 pt-6">
                <p className="font-body text-sm text-muted-foreground text-center mb-4">
                  Speak with our showroom expert
                </p>
                <div className="flex flex-col items-center gap-3">
                  {!showPhoneNumber ? (
                    <button
                      onClick={handleCallToReserve}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-colors font-body text-sm font-semibold"
                    >
                      <Phone className="w-4 h-4" />
                      Call to Reserve
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-6 py-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <Phone className="w-4 h-4 text-blue-400" />
                      <a
                        href={`tel:${PHONE_NUMBER}`}
                        className="text-blue-400 font-body text-lg font-semibold hover:text-blue-300 transition-colors"
                      >
                        {PHONE_NUMBER}
                      </a>
                      <button
                        onClick={handleCopyPhone}
                        className="ml-2 p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="Copy phone number"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-blue-400" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          {showOrderForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12"
              id="customer-details-form"
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-display text-2xl flex items-center gap-2">
                    <User className="w-6 h-6 text-primary" />
                    Customer Details
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Please provide your details to complete the order
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitOrder} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={customerDetails.name}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                          required
                          className="h-12"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={customerDetails.phone}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter your phone number"
                          required
                          className="h-12"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerDetails.email}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email address"
                          className="h-12"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="space-y-2">
                        <Label htmlFor="quantity" className="text-sm font-medium">
                          Quantity
                        </Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          max="10"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          className="h-12"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Delivery Address
                      </Label>
                      <Textarea
                        id="address"
                        value={customerDetails.address}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter your delivery address"
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    {/* Order Summary */}
                    <div className="bg-muted/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Product:</span>
                          <span className="text-foreground">{product.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="text-foreground">{product.discountPrice || product.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quantity:</span>
                          <span className="text-foreground">{quantity}</span>
                        </div>
                        <div className="border-t border-border pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span className="text-foreground">Total:</span>
                            <span className="text-primary">{product.discountPrice || product.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowOrderForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-primary hover:bg-gold-light"
                        disabled={!customerDetails.name || !customerDetails.phone}
                      >
                        Proceed to Payment
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;// Commit 6 - 2024-05-03 17:48:00
