
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import DispatchHub from "./pages/DispatchHub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dispatch" element={<DispatchHub />} />
              <Route path="clients" element={<div>Clients & Locations - Coming Soon</div>} />
              <Route path="fleet" element={<div>Fleet Management - Coming Soon</div>} />
              <Route path="technicians" element={<div>Technicians - Coming Soon</div>} />
              <Route path="jobs" element={<div>Jobs & Scheduling - Coming Soon</div>} />
              <Route path="inventory" element={<div>Inventory - Coming Soon</div>} />
              <Route path="services" element={<div>Services Catalog - Coming Soon</div>} />
              <Route path="analytics" element={<div>Analytics - Coming Soon</div>} />
              <Route path="notifications" element={<div>Notifications - Coming Soon</div>} />
              <Route path="settings" element={<div>Settings - Coming Soon</div>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
