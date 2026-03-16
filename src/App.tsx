import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";

// Feature Imports
import QuestBoard from "@/features/quests/pages/QuestBoard";
import QuestDetail from "@/features/quests/pages/QuestDetail";
import QuestWorkspace from "@/features/quests/pages/QuestWorkspace";
import CreateQuest from "@/features/quests/pages/CreateQuest";
import EditQuest from "@/features/quests/pages/Edit/EditQuest";
import SubmitBid from "@/features/bids/pages/SubmitBid";
import ProviderBids from "@/features/bids/pages/ProviderBids";
import RewardShop from "@/features/rewards/pages/RewardShop";
import UserProfile from "@/features/users/pages/UserProfile";
import EditUserProfile from "@/features/users/pages/Edit/EditUserProfile";
import PointsAnimation from "@/features/users/components/PointsAnimation";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <PointsAnimation />
        <div className="min-h-screen wood-bg">
          <Navbar />
          <Routes>
            <Route path="/" element={<QuestBoard />} />
            <Route path="/quest/:id" element={<QuestDetail />} />
            <Route path="/quest/:id/bid" element={<SubmitBid />} />
            <Route path="/quest/:id/bids" element={<ProviderBids />} />
            <Route path="/quest/:id/workspace" element={<QuestWorkspace />} />
            <Route path="/create-quest" element={<CreateQuest />} />
            <Route path="/quest/:id/edit" element={<EditQuest />} />
            <Route path="/reward-shop" element={<RewardShop />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/edit" element={<EditUserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
