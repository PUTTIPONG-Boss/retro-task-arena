import React from "react";
import { useTranslation } from "react-i18next";

export type TabType = "quests" | "financials" | "activity";

interface ProfileTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab }) => {
  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[16px]";

  const tabs: TabType[] = ["quests", "financials", "activity"];

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pixel-border px-4 py-2 transition-all font-pixel !text-[14px] bg-[#eab308] text-black hover:bg-[#facc15] shadow-[inset_-2px_-2px_0_0_rgba(0,0,0,0.3)] ${fontClass} ${
              activeTab === tab ? "opacity-100" : "opacity-60"
            }`}
          >
            {t(`userProfile.btn.${tab}`).toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;
