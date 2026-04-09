import { useEffect, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderSummary {
  productName: string;
  productPrice: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  quantity: number;
  totalAmount: string;
}

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cash" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Get order details from URL parameters
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
      });
    } else {
      // Redirect back if missing required data
      navigate("/");
    }
  }, [searchParams, navigate]);

  const handlePayment = async () => {
    if (!orderSummary || !paymentMethod) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Create WhatsApp message with order details
      const message = `New Order Details:
      
Product: ${orderSummary.productName}
Price: ${orderSummary.productPrice}
Quantity: ${orderSummary.quantity}
Total: ${orderSummary.totalAmount}

Customer Details:
Name: ${orderSummary.customerName}
Phone: ${orderSummary.customerPhone}
Email: ${orderSummary.customerEmail}
Address: ${orderSummary.customerAddress}

Payment Method: ${paymentMethod === "bank" ? "Bank Transfer" : "Cash on Delivery"}

Please confirm this order and provide further instructions.`;

      const whatsappUrl = `https://wa.me/251911288820?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      // Redirect to success page or home
      navigate("/order-success");
    }, 2000);
  };

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
                {/* Bank Transfer */}
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "bank"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setPaymentMethod("bank")}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Bank Transfer</h3>
                      <p className="text-sm text-muted-foreground">
                        Pay via bank transfer - we'll provide account details
                      </p>
                    </div>
                    {paymentMethod === "bank" && (
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
                      Your order will be processed securely through WhatsApp with our sales team
                    </p>
                  </div>
                </div>

                {/* Complete Order Button */}
                <Button
                  onClick={handlePayment}
                  disabled={!paymentMethod || isProcessing}
                  className="w-full py-6 text-base font-semibold tracking-wide"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Order...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Complete Order via WhatsApp
                    </div>
                  )}
                </Button>

                {/* Alternative Contact */}
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    Prefer to order by phone?
                  </p>
                  <a
                    href="tel:0911288820"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors font-body text-sm font-semibold"
                  >
                    <Phone className="w-4 h-4" />
                    Call 0911 288 820
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

export default Payment;