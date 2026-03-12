import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import QuestBoard from "./pages/QuestBoard";
import QuestDetail from "./pages/QuestDetail";
import SubmitBid from "./pages/SubmitBid";
import ProviderBids from "./pages/ProviderBids";
import QuestWorkspace from "./pages/QuestWorkspace";
import RewardShop from "./pages/RewardShop";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <div className="min-h-screen wood-bg">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<QuestBoard />} />
            <Route path="/quest/:id" element={<QuestDetail />} />
            <Route path="/quest/:id/bid" element={<SubmitBid />} />
            <Route path="/quest/:id/bids" element={<ProviderBids />} />
            <Route path="/quest/:id/workspace" element={<QuestWorkspace />} />
            <Route path="/reward-shop" element={<RewardShop />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
