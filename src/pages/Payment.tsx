import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  CreditCard, 
  Shield, 
  CheckCircle2, 
  Phone, 
  MessageCircle,
  Package,
  Truck,
  Clock
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface OrderSummary {
  productName: string;
  productPrice: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  quantity: number;
  totalAmount: string;
  fromCart?: boolean;
}

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items: cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"chapa" | "cash" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const chapaFormRef = useRef<HTMLFormElement>(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
  });

  const fromCart = searchParams.get("fromCart") === "true";

  useEffect(() => {
    if (fromCart && cartItems.length > 0) {
      // Handle cart checkout - show form to collect customer details
      const totalAmount = searchParams.get("totalAmount") || "";
      setOrderSummary({
        productName: `${cartItems.length} item(s)`,
        productPrice: totalAmount,
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerAddress: "",
        quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount,
        fromCart: true,
      });
    } else {
      // Handle single product checkout
      const productName = searchParams.get("productName");
      const productPrice = searchParams.get("productPrice");
      const customerName = searchParams.get("customerName");
      const customerEmail = searchParams.get("customerEmail");
      const customerPhone = searchParams.get("customerPhone");
      const customerAddress = searchParams.get("customerAddress");
      const quantity = parseInt(searchParams.get("quantity") || "1");
      const totalAmount = searchParams.get("totalAmount");

      if (productName && customerName && customerPhone) {
        setOrderSummary({
          productName,
          productPrice: productPrice || "",
          customerName,
          customerEmail: customerEmail || "",
          customerPhone,
          customerAddress: customerAddress || "",
          quantity,
          totalAmount: totalAmount || productPrice || "",
          fromCart: false,
        });
      } else if (!fromCart) {
        // Redirect back if missing required data
        navigate("/");
      }
    }
  }, [searchParams, navigate, fromCart, cartItems]);

  const handlePayment = async () => {
    if (!orderSummary || !paymentMethod) return;
    
    // For cart checkout, validate customer details
    if (fromCart && (!customerDetails.name || !customerDetails.phone)) {
      toast.error("Please fill in your name and phone number");
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === "chapa") {
        // Submit the Chapa form directly
        if (chapaFormRef.current) {
          chapaFormRef.current.submit();
        }
      } else if (paymentMethod === "cash") {
        // Cash on delivery - just create order
        console.log("Order submitted:", {
          orderSummary: fromCart ? {
            ...orderSummary,
            customerName: customerDetails.name,
            customerEmail: customerDetails.email,
            customerPhone: customerDetails.phone,
            customerAddress: customerDetails.address,
          } : orderSummary,
          cartItems: fromCart ? cartItems : null,
          paymentMethod: "cash",
        });

        // Clear cart if checkout from cart
        if (fromCart) {
          clearCart();
        }

        toast.success("Order placed successfully!");
        navigate("/order-success");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  // Generate transaction reference
  const txRef = `addis-majlis-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  // Calculate amount and prepare customer data
  const amount = parseFloat(orderSummary?.totalAmount.replace(/[^\d.]/g, '') || '0');
  const customerName = fromCart ? customerDetails.name : orderSummary?.customerName || '';
  const [firstName, ...lastNameParts] = customerName.split(' ');
  const lastName = lastNameParts.join(' ') || firstName;
  const email = fromCart ? customerDetails.email : orderSummary?.customerEmail || 'customer@addismajlis.com';
  const phone = fromCart ? customerDetails.phone : orderSummary?.customerPhone || '';
  const description = fromCart 
    ? `Payment for ${cartItems.length} item(s)` 
    : `Payment for ${orderSummary?.productName || 'furniture'}`;

  if (!orderSummary) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hidden Chapa Payment Form */}
      <form 
        ref={chapaFormRef}
        method="POST" 
        action="https://api.chapa.co/v1/hosted/pay"
        style={{ display: 'none' }}
      >
        <input type="hidden" name="public_key" value={import.meta.env.VITE_CHAPA_PUBLIC_KEY} />
        <input type="hidden" name="tx_ref" value={txRef} />
        <input type="hidden" name="amount" value={amount.toString()} />
        <input type="hidden" name="currency" value="ETB" />
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="first_name" value={firstName} />
        <input type="hidden" name="last_name" value={lastName} />
        <input type="hidden" name="title" value="Addis Majlis Glory" />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="logo" value="https://chapa.link/asset/images/chapa_swirl.svg" />
        <input type="hidden" name="callback_url" value={`${window.location.origin}/payment/callback`} />
        <input type="hidden" name="return_url" value={`${window.location.origin}/payment/verify?tx_ref=${txRef}`} />
        <input type="hidden" name="meta[phone]" value={phone} />
      </form>

      <section className="pt-32 pb-16 bg-charcoal-gradient">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Complete Your Order
            </h1>
            <p className="text-muted-foreground">
              Review your order details and choose your preferred payment method
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fromCart && cartItems.length > 0 ? (
                  <>
                    {/* Cart Items */}
                    <div className="space-y-3 border-b border-border pb-4">
                      {cartItems.map((item) => {
                        const price = item.discountPrice || item.price;
                        const numPrice = parseFloat(price.replace(/[^\d.]/g, ''));
                        const itemTotal = numPrice * item.quantity;
                        
                        return (
                          <div key={`${item.id}-${item.selectedColor || 'default'}`} className="flex gap-3">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded border border-border"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground text-sm">{item.name}</h4>
                              <p className="text-xs text-muted-foreground">{item.material}</p>
                              {item.selectedColor && (
                                <p className="text-xs text-muted-foreground">Color: {item.selectedColor}</p>
                              )}
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                                <span className="text-sm font-semibold text-foreground">{itemTotal.toFixed(2)} Birr</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Customer Details Form for Cart Checkout */}
                    <div className="border-b border-border pb-4">
                      <h4 className="font-semibold text-foreground mb-3">Customer Details</h4>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="customer-name" className="text-xs">Full Name *</Label>
                          <Input
                            id="customer-name"
                            type="text"
                            value={customerDetails.name}
                            onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your name"
                            required
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="customer-phone" className="text-xs">Phone Number *</Label>
                          <Input
                            id="customer-phone"
                            type="tel"
                            value={customerDetails.phone}
                            onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="Enter your phone"
                            required
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="customer-address" className="text-xs">Delivery Address</Label>
                          <Input
                            id="customer-address"
                            type="text"
                            value={customerDetails.address}
                            onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Enter delivery address"
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Single Product */}
                    <div className="border-b border-border pb-4">
                      <h3 className="font-semibold text-foreground mb-2">{orderSummary.productName}</h3>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="text-foreground">{orderSummary.productPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="text-foreground">{orderSummary.quantity}</span>
                      </div>
                    </div>

                    <div className="border-b border-border pb-4">
                      <h4 className="font-semibold text-foreground mb-2">Customer Details</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="text-foreground">{orderSummary.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="text-foreground">{orderSummary.customerPhone}</span>
                        </div>
                        {orderSummary.customerEmail && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="text-foreground">{orderSummary.customerEmail}</span>
                          </div>
                        )}
                        {orderSummary.customerAddress && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Address:</span>
                            <span className="text-foreground text-right max-w-[200px]">{orderSummary.customerAddress}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-foreground">Total Amount:</span>
                  <span className="text-primary">{orderSummary.totalAmount}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-xl">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chapa Payment */}
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "chapa"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setPaymentMethod("chapa")}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Pay with Chapa</h3>
                      <p className="text-sm text-muted-foreground">
                        Secure online payment via Chapa - supports all major banks and mobile money
                      </p>
                    </div>
                    {paymentMethod === "chapa" && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "cash"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Cash on Delivery</h3>
                      <p className="text-sm text-muted-foreground">
                        Pay when your furniture is delivered to your location
                      </p>
                    </div>
                    {paymentMethod === "cash" && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground font-medium">Secure Transaction</p>
                    <p className="text-xs text-muted-foreground">
                      {paymentMethod === "chapa" 
                        ? "Your payment is processed securely through Chapa's encrypted payment gateway"
                        : "Your order will be confirmed and delivered with cash payment option"}
                    </p>
                  </div>
                </div>

                {/* Complete Order Button */}
                <Button
                  onClick={handlePayment}
                  disabled={
                    !paymentMethod || 
                    (fromCart && (!customerDetails.name || !customerDetails.phone)) ||
                    isProcessing
                  }
                  className="w-full py-6 text-base font-semibold tracking-wide"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Order...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      {paymentMethod === "chapa" ? "Proceed to Payment" : "Complete Order"}
                    </div>
                  )}
                </Button>

                {/* Alternative Contact */}
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    Prefer to order by phone?
                  </p>
                  <a
                    href="tel:0995871152"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors font-body text-sm font-semibold"
                  >
                    <Phone className="w-4 h-4" />
                    Call 0995871152
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Information */}
          <Card className="bg-card border-border mt-8">
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Free Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Free delivery within Addis Ababa for all furniture orders
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Quick Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Most items delivered within 3-7 business days
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Quality Guarantee</h3>
                  <p className="text-sm text-muted-foreground">
                    10-year warranty on all handcrafted furniture pieces
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Payment;// Commit 9 - 2024-05-05 12:54:00
// Commit 10 - 2024-05-05 20:45:00
// Commit 27 - 2024-05-11 01:35:00
// Commit 33 - 2024-05-17 09:13:00
// Commit 39 - 2024-05-20 17:03:00
// Commit 48 - 2024-05-23 23:34:00
// Commit 23 - 2024-05-07 13:23:00
// Commit 29 - 2024-05-10 17:43:00
