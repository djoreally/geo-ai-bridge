
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import DispatchHub from "./pages/DispatchHub";
import ClientsLocations from "./pages/ClientsLocations";
import FleetManagement from "./pages/FleetManagement";
import Technicians from "./pages/Technicians";
import JobsScheduling from "./pages/JobsScheduling";
import Inventory from "./pages/Inventory";
import ServicesCatalog from "./pages/ServicesCatalog";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
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
              <Route path="clients" element={<ClientsLocations />} />
              <Route path="fleet" element={<FleetManagement />} />
              <Route path="technicians" element={<Technicians />} />
              <Route path="jobs" element={<JobsScheduling />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="services" element={<ServicesCatalog />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
