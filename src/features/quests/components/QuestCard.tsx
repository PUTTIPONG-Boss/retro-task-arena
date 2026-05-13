import { Quest } from "../types";
import { useThemeStore } from "@/store/themeStore";
import QuestCardDark from "@/themes/dark/QuestCard";
import QuestCardLight from "@/themes/light/QuestCard";

interface QuestCardProps {
  quest: Quest;
}

const QuestCard = ({ quest }: QuestCardProps) => {
  const { theme } = useThemeStore();
  return theme === "light" ? <QuestCardLight quest={quest} /> : <QuestCardDark quest={quest} />;
};

export default QuestCard;
