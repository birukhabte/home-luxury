import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductShowcase from "@/components/ProductShowcase";
import PromotionalSection from "@/components/PromotionalSection";
import FeaturesSection from "@/components/FeaturesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <PromotionalSection />
      <ProductShowcase />
      <FeaturesSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
