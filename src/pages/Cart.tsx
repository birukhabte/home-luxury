import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/payment?fromCart=true&totalAmount=${encodeURIComponent(getTotalPrice())}`);
      return;
    }
    
    // Navigate to payment with cart items
    const params = new URLSearchParams({
      fromCart: 'true',
      totalAmount: getTotalPrice(),
    });
    navigate(`/payment?${params.toString()}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16">
          <div className="container mx-auto px-6 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto"
            >
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-muted-foreground mb-8">
                Start adding some luxury furniture to your cart
              </p>
              <Link to="/products">
                <Button className="bg-primary hover:bg-gold-light">
                  Browse Products
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6 lg:px-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground mt-2">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.selectedColor || 'default'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Image */}
                        {item.imageUrl && (
                          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-border">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.material}
                          </p>
                          {item.selectedColor && (
                            <p className="text-xs text-muted-foreground mb-2">
                              Color: <span className="text-foreground">{item.selectedColor}</span>
                            </p>
                          )}
                          
                          <div className="flex items-center gap-3">
                            {item.originalPrice && item.discountPrice ? (
                              <>
                                <span className="text-muted-foreground line-through text-sm">
                                  {item.originalPrice}
                                </span>
                                <span className="text-primary font-bold">
                                  {item.discountPrice}
                                </span>
                              </>
                            ) : (
                              <span className="text-foreground font-bold">
                                {item.price}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="flex items-center gap-2 border border-border rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-muted/50 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-muted/50 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-card border-border sticky top-24">
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-bold text-foreground mb-4">
                      Order Summary
                    </h2>

                    <div className="space-y-3 mb-6">
                      {items.map((item) => {
                        const price = item.discountPrice || item.price;
                        const numPrice = parseFloat(price.replace(/[^\d.]/g, ''));
                        const itemTotal = numPrice * item.quantity;
                        
                        return (
                          <div
                            key={`${item.id}-${item.selectedColor || 'default'}`}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {item.name} x {item.quantity}
                            </span>
                            <span className="text-foreground">
                              {itemTotal.toFixed(2)} Birr
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-border pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="font-display text-lg font-semibold text-foreground">
                          Total
                        </span>
                        <span className="font-display text-2xl font-bold text-primary">
                          {getTotalPrice()}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-primary hover:bg-gold-light text-primary-foreground font-semibold"
                    >
                      Proceed to Checkout
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Free shipping within Addis Ababa
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cart;
// Commit 24 - 2024-05-10 19:33:00
