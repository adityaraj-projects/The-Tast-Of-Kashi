import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";

// Lazy-loaded pages (Module 14)
const Login = lazy(() => import("@/pages/login"));
const Signup = lazy(() => import("@/pages/signup"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const AuthCallback = lazy(() => import("@/pages/auth-callback"));
const VerifyEmail = lazy(() => import("@/pages/verify-email"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Foods = lazy(() => import("@/pages/foods"));
const Attractions = lazy(() => import("@/pages/attractions"));
const Stories = lazy(() => import("@/pages/stories"));
const Vendors = lazy(() => import("@/pages/vendors"));
const Events = lazy(() => import("@/pages/events"));
const MapExplorer = lazy(() => import("@/pages/map"));
const Wishlist = lazy(() => import("@/pages/wishlist"));
const AiAssistant = lazy(() => import("@/pages/ai-assistant"));
const Settings = lazy(() => import("@/pages/settings"));
const Community = lazy(() => import("./pages/community"));

const queryClient = new QueryClient();

// Premium Skeleton Loader Loader Layout (Module 14)
function PageSkeleton() {
  return (
    <div className="w-full min-h-screen bg-[#0B0907] p-8 space-y-6 text-left animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center pb-6 border-b border-white/5">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/10 rounded-xl" />
          <div className="h-4 w-64 bg-white/5 rounded-lg" />
        </div>
        <div className="w-10 h-10 rounded-full bg-white/10" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-60 rounded-3xl bg-white/5 border border-white/5 p-5 space-y-4">
            <div className="h-32 rounded-2xl bg-white/10 w-full" />
            <div className="space-y-2">
              <div className="h-5 bg-white/10 rounded-lg w-2/3" />
              <div className="h-4 bg-white/5 rounded-lg w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/auth/callback" component={AuthCallback} />
        <Route path="/verify-email" component={VerifyEmail} />

        <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
        <Route path="/foods" component={() => <ProtectedRoute component={Foods} />} />
        <Route path="/attractions" component={() => <ProtectedRoute component={Attractions} />} />
        <Route path="/vendors" component={() => <ProtectedRoute component={Vendors} />} />
        <Route path="/stories" component={() => <ProtectedRoute component={Stories} />} />
        <Route path="/wishlist" component={() => <ProtectedRoute component={Wishlist} />} />
        <Route path="/map" component={() => <ProtectedRoute component={MapExplorer} />} />
        <Route path="/ai-assistant" component={() => <ProtectedRoute component={AiAssistant} />} />
        <Route path="/events" component={() => <ProtectedRoute component={Events} />} />
        <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />
        <Route path="/community" component={() => <ProtectedRoute component={Community} />} />

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
