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
import PaymentVerify from "./pages/PaymentVerify.tsx";
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
              <Route path="/payment/verify" element={<PaymentVerify />} />
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
// Commit 3 - 2024-05-01 21:53:00
// Commit 8 - 2024-05-05 16:25:00
// Commit 11 - 2024-05-05 07:56:00
// Commit 15 - 2024-05-07 12:34:00
// Commit 28 - 2024-05-12 17:36:00
// Commit 36 - 2024-05-19 03:13:00
// Commit 57 - 2024-05-27 03:54:00
// Commit 58 - 2024-05-27 02:12:00
// Commit 8 - 2024-05-02 09:47:00
