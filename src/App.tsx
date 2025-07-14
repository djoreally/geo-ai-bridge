
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConvexProvider } from "convex/react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { AuthProvider } from "@/contexts/AuthContext";
import { PageTracker } from "@/components/analytics/PageTracker";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import convex from "./lib/convex";
import { validateEnv } from "./lib/env";

// Validate environment variables on app start
try {
  validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error);
}

const App = () => (
  <ErrorBoundary>
    <ConvexProvider client={convex}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageTracker />
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="dispatch" element={<div>Dispatch Hub - Coming Soon</div>} />
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
              <Route path="/login" element={<div>Login Page - Coming Soon</div>} />
              <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ConvexProvider>
  </ErrorBoundary>
);

export default App;
