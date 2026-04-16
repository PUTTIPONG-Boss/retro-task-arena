import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUserStore } from "@/features/users/store/userStore";
import { useGetQuests } from "@/features/quests/services/quest.service";
import { getTransactions, Transaction } from "@/features/finance/services/finance.service";
import { getMyBids, MyBid } from "@/features/finance/services/application.service";
import { useGetMyOrders } from "@/features/rewards/services/order.service";

// Components
import ProfileHeader from "../components/ProfileHeader";
import ProfileStats from "../components/ProfileStats";
import ProfileSkills from "../components/ProfileSkills";
import ProfileLinks from "../components/ProfileLinks";
import ProfileTabs, { TabType } from "../components/ProfileTabs";
import ActiveQuestsTab from "../components/tabs/ActiveQuestsTab";
import PostedQuestsTab from "../components/tabs/PostedQuestsTab";
import FinancialsTab from "../components/tabs/FinancialsTab";
import ActivityTab from "../components/tabs/ActivityTab";

// Role helpers
const isJuniorOrSenior = (role: string) => {
  const r = role.toLowerCase();
  return r.includes("junior") || r.includes("senior");
};

const isSeniorOrAdmin = (role: string) => {
  const r = role.toLowerCase();
  return r.includes("senior") || r === "admin";
};

const UserProfile = () => {
  const user = useUserStore((state) => state.user);
  const { data: quests = [] } = useGetQuests();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bids, setBids] = useState<MyBid[]>([]);

  const { data: orders = [] } = useGetMyOrders(user?.id);

  const { i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[20px]" : "text-[20px]";

  // Build available tabs based on role
  const availableTabs = useMemo<TabType[]>(() => {
    if (!user) return ["quests", "financials", "activity"];

    const tabs: TabType[] = ["quests"];

    if (isJuniorOrSenior(user.role)) {
      tabs.push("activeQuests");
    }

    if (isSeniorOrAdmin(user.role)) {
      tabs.push("postedQuests");
    }

    tabs.push("financials", "activity");
    return tabs;
  }, [user]);

  const [activeTab, setActiveTab] = useState<TabType>("quests");

  // Reset to first available tab if current tab becomes unavailable
  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  useEffect(() => {
    if (activeTab === "financials") {
      getTransactions().then(setTransactions).catch(console.error);
    } else if (activeTab === "activity") {
      getMyBids().then(setBids).catch(console.error);
    }
  }, [activeTab]);

  if (!user) return null;

  return (
    <div
      className={`max-w-[900px] mx-auto px-4 py-8 font-pixel ${fontClass}`}
    >
      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        availableTabs={availableTabs}
      />

      {activeTab === "quests" && (
        <>
          <ProfileHeader user={user} />
          <ProfileStats user={user} />
          <ProfileSkills skills={user.skills} />
          <ProfileLinks githubUrl={user.github} linkinUrl={user.linkin} />
        </>
      )}

      {activeTab === "activeQuests" && (
        <ActiveQuestsTab user={user} quests={quests} />
      )}

      {activeTab === "postedQuests" && (
        <PostedQuestsTab user={user} quests={quests} />
      )}

      {activeTab === "financials" && (
        <FinancialsTab
          userPoints={user.points}
          transactions={transactions}
          orders={orders}
        />
      )}

      {activeTab === "activity" && <ActivityTab bids={bids} quests={quests} user={user} />}
    </div>
  );
};

export default UserProfile;
