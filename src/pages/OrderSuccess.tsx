import { Link } from "react-router-dom";
import { CheckCircle2, Home, MessageCircle, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16 bg-charcoal-gradient">
        <div className="container mx-auto px-6 lg:px-16 max-w-2xl">
          <Card className="bg-card border-border text-center">
            <CardContent className="pt-12 pb-8">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>

              {/* Success Message */}
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Order Submitted Successfully!
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Thank you for your order. Our sales team will contact you shortly via WhatsApp to confirm your order details and arrange delivery.
              </p>

              {/* What's Next */}
              <div className="bg-muted/20 p-6 rounded-lg mb-8 text-left">
                <h2 className="font-semibold text-foreground mb-4">What happens next?</h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <p>Our sales team will contact you within 30 minutes to confirm your order</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <p>We'll arrange delivery and provide payment instructions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <p>Your luxury furniture will be delivered within 3-7 business days</p>
                  </div>
                </div>
              </div>

              {/* Contact Options */}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Need immediate assistance?
                </p>
                <div className="flex gap-4 justify-center">
                  <a
                    href="tel:0911288820"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors font-body text-sm font-semibold"
                  >
                    <Phone className="w-4 h-4" />
                    Call Us
                  </a>
                  <a
                    href="https://wa.me/251911288820?text=Hi! I just placed an order and need assistance."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors font-body text-sm font-semibold"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Back to Home */}
              <div className="mt-8">
                <Link to="/">
                  <Button className="bg-primary hover:bg-gold-light">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrderSuccess;