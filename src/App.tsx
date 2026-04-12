import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import AllProducts from "./pages/AllProducts.tsx";
import LuxurySofas from "./pages/LuxurySofas.tsx";
import ArabianMajlis from "./pages/ArabianMajlis.tsx";
import LuxuryTVStands from "./pages/LuxuryTVStands.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Cart from "./pages/Cart.tsx";
import Login from "./pages/Login.tsx";
import Payment from "./pages/Payment.tsx";
import OrderSuccess from "./pages/OrderSuccess.tsx";
import SovereignOrder from "./pages/SovereignOrder.tsx";
import SofaOrder from "./pages/SofaOrder.tsx";
import CustomerPromotions from "./pages/Promotions.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import Products from "./pages/admin/Products.tsx";
import Inquiries from "./pages/admin/Inquiries.tsx";
import AdminPromotions from "./pages/admin/Promotions.tsx";
import Orders from "./pages/admin/Orders.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<AllProducts />} />
              <Route path="/luxury-sofas" element={<LuxurySofas />} />
              <Route path="/arabian-majlis" element={<ArabianMajlis />} />
              <Route path="/luxury-tv-stands" element={<LuxuryTVStands />} />
              <Route path="/promotions" element={<CustomerPromotions />} />
              <Route path="/:productSlug/sofa-detail" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/sovereign-order" element={<SovereignOrder />} />
              <Route path="/sofa-order/:sofaId" element={<SofaOrder />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="promotions" element={<AdminPromotions />} />
                <Route path="orders" element={<Orders />} />
                <Route path="inquiries" element={<Inquiries />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
