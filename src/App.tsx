import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import PixelBackground from "@/components/PixelBackground";

// Auth
import LoginPage from "@/features/auth/pages/LoginPage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

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
import AuthSyncProvider from "@/features/auth/components/AuthSyncProvider";

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <PointsAnimation />
    <div className="relative z-10 min-h-screen">
      <Navbar />
      {children}
    </div>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <PixelBackground />
        <AuthSyncProvider />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedLayout>
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
              </ProtectedLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
