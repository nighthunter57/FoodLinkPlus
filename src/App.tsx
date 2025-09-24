// Notifications, Toast popups, and tooltips
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Manages server state / API calls and caching 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Manages navigation between pages
import { BrowserRouter, Routes, Route } from "react-router-dom";

//
import { AppProvider } from "@/contexts/AppContext";

// are the home page and the not found page
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// This creates a React Query Client instance, which React Query needs to work
// You only create this once at the app root
const queryClient = new QueryClient();


const App = () => (
  
  //Wraps your whole app within the QueryClient Provider to give every component access to 
  // the features (fetching, caching, validation)
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

/**
 * QueryClientProvider --> This wraps everything to give every component the ability to access features
 * like fetching, caching, validation
 * ? What does it do?
 * * --> Handles API Fetching and caching automitcally
 * * --> Keeps track of the "state" of your requests (load, error, success)
 * * --> Lets you easily invalidate or refetch data anywhere in your app without prop drilling
 * * ====) This is at the top because any componenet can use hooks like useQuery or useMutation to fetch/update data
 * 
 * TooltipProvider -->  Wraps everything to allow tooltips anywhere in the apps
 * ? What does it do?
 * * --> Provides a global context for tooltips so that any <Tooltip> inside it behaves consistently 
 * * --> Handles things like positioning, accessibility, and closing/opening logic.
 * 
 * ? What does it do? (Toast)
 * * --> When you call toast like toast("Message sent!"), this is the component that actually shows the pop-up
 * * --> Manages styling, animation, and queuing of multiple toasts
 * 
 * ? What does it do? (Sonner)
 * * --> Works the same way as Toaster but probably with a different design or API
 * * --> Your app seems to be importing two toast systems - probably because one's default for your UI kit
 * * and the other is from a library like Sonner
 * * ====) Think of these as notification managers; only one actually needs to be used unless you want both styles
 * Toaster + Sonner --> Are both toast notifications systems (One is your Toaster, the is Sonner)
 * They render at the top level so you can call toast() from anywhere and have it show up.
 * 
 * BrowserRouter --> Is your router that enables navigation and URL-based routing
 * 
 * Routes --> Contains all your app's routes
 * --- / renders the Index page
 * --- * (wildcard) --> renders the NotFound page if no route matches (This is your 404 handler)
 */


// This file is basically the "shell" of your React app. It's where you wrap you entire UI in:
// Global state providers (React Query, Context)
// Notifications/tooltips systems
// Routing  logic
export default App;
