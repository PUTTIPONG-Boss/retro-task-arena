import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import AdminLayout from "@/features/admin/components/AdminLayout";
import AdminSidebar from "@/features/admin/components/AdminSidebar";
import PixelBackground from "@/components/PixelBackground";

// Auth
import LoginPage from "@/features/auth/pages/LoginPage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { useAuthStore } from "@/features/auth/store/authStore";

// Feature Imports
import QuestBoard from "@/features/quests/pages/QuestBoard";
import QuestDetail from "@/features/quests/pages/QuestDetail";
import QuestWorkspace from "@/features/quests/pages/QuestWorkspace";
import CreateQuest from "@/features/quests/pages/create/CreateQuest";
import EditQuest from "@/features/quests/pages/Edit/EditQuest";
import SubmitBid from "@/features/bids/pages/SubmitBid";
import ProviderBids from "@/features/bids/pages/ProviderBids";
import RewardShop from "@/features/rewards/pages/RewardShop";
import AddProduct from "@/features/rewards/pages/create/AddProduct";
import EditProduct from "@/features/rewards/pages/edit/EditProduct";
import UserProfile from "@/features/users/pages/UserProfile";
import EditUserProfile from "@/features/users/pages/Edit/EditUserProfile";
import ManageSenior from "@/features/admin/pages/ManageSenior";
import ManageJunior from "@/features/admin/pages/ManageJunior";
import ManageQuests from "@/features/admin/pages/ManageQuests";
import ManageReward from "@/features/admin/pages/ManageReward";
import ManageOrders from "@/features/admin/pages/ManageOrders";

import NotFound from "./pages/NotFound";
import AuthSyncProvider from "@/features/auth/components/AuthSyncProvider";

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="min-h-screen bg-transparent flex items-center justify-center text-accent font-pixel">Loading Guild Data...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="relative z-10 h-screen flex flex-col bg-transparent">
        <Navbar />
        <main className="flex-1 h-full overflow-y-auto w-full relative z-10">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
};


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
                  <Route path="/add-product" element={<AddProduct />} />
                  <Route path="/edit-product/:id" element={<EditProduct />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/profile/edit" element={<EditUserProfile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="managesenior" element={<ManageSenior />} />
            <Route path="managejunior" element={<ManageJunior />} />
            <Route path="managequest" element={<ManageQuests />} />
            <Route path="managereward" element={<ManageReward />} />
            <Route path="manageorder" element={<ManageOrders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
