import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import LuxurySofas from "./pages/LuxurySofas.tsx";
import ArabianMajlis from "./pages/ArabianMajlis.tsx";
import LuxuryTVStands from "./pages/LuxuryTVStands.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import Products from "./pages/admin/Products.tsx";
import Inquiries from "./pages/admin/Inquiries.tsx";
import Promotions from "./pages/admin/Promotions.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/luxury-sofas" element={<LuxurySofas />} />
          <Route path="/arabian-majlis" element={<ArabianMajlis />} />
          <Route path="/luxury-tv-stands" element={<LuxuryTVStands />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="inquiries" element={<Inquiries />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
