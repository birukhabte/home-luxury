import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiGet } from "@/lib/api";

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [paymentData, setPaymentData] = useState<any>(null);

  const txRef = searchParams.get("tx_ref");

  useEffect(() => {
    if (!txRef) {
      navigate("/");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await apiGet(`/chapa/verify?tx_ref=${txRef}`);
        
        if (response.status === "success" && response.data.status === "success") {
          setStatus("success");
          setPaymentData(response.data);
          
          // Wait 2 seconds then redirect to success page
          setTimeout(() => {
            navigate("/order-success");
          }, 2000);
        } else {
          setStatus("failed");
          setPaymentData(response.data);
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [txRef, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6 lg:px-16 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="bg-card border-border">
              <CardContent className="p-12">
                {status === "loading" && (
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-foreground">
                      Verifying Payment
                    </h1>
                    <p className="text-muted-foreground">
                      Please wait while we verify your payment...
                    </p>
                  </div>
                )}

                {status === "success" && (
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-foreground">
                      Payment Successful!
                    </h1>
                    <p className="text-muted-foreground">
                      Your payment has been verified successfully.
                    </p>
                    {paymentData && (
                      <div className="bg-muted/20 rounded-lg p-4 text-left">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount:</span>
                            <span className="text-foreground font-semibold">
                              {paymentData.amount} {paymentData.currency}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Reference:</span>
                            <span className="text-foreground font-mono text-xs">
                              {paymentData.reference}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Redirecting to order confirmation...
                    </p>
                  </div>
                )}

                {status === "failed" && (
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                      <XCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-foreground">
                      Payment Failed
                    </h1>
                    <p className="text-muted-foreground">
                      We couldn't verify your payment. Please try again or contact support.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={() => navigate("/cart")}
                        variant="outline"
                      >
                        Back to Cart
                      </Button>
                      <Button
                        onClick={() => navigate("/")}
                        className="bg-primary hover:bg-gold-light"
                      >
                        Go to Home
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaymentVerify;
