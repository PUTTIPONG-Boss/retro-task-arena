import { useState, useEffect } from "react";
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
import QuestsTab from "../components/tabs/QuestsTab";
import FinancialsTab from "../components/tabs/FinancialsTab";
import ActivityTab from "../components/tabs/ActivityTab";

const UserProfile = () => {
  const user = useUserStore((state) => state.user);
  const { data: quests = [] } = useGetQuests();
  const [activeTab, setActiveTab] = useState<TabType>("quests");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bids, setBids] = useState<MyBid[]>([]);

  // Fetch orders using the new hook
  const { data: orders = [] } = useGetMyOrders(user?.id);

  const { i18n } = useTranslation();

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
      className={`max-w-[900px] mx-auto px-4 py-8 ${
        i18n.language === "th" ? "font-['TA_8bit']" : ""
      }`}
    >
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "quests" && (
        <>
          <ProfileHeader user={user} />
          <ProfileStats user={user} />
          <ProfileSkills skills={user.skills} />
          <ProfileLinks githubUrl={user.githubUrl} />
          <QuestsTab user={user} quests={quests} />
        </>
      )}

      {activeTab === "financials" && (
        <FinancialsTab
          userPoints={user.points}
          transactions={transactions}
          orders={orders}
        />
      )}

      {activeTab === "activity" && <ActivityTab bids={bids} />}
    </div>
  );
};

export default UserProfile;
