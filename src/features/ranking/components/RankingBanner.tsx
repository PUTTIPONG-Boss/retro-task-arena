import { useThemeStore } from '@/store/themeStore';
import RankingBannerDark from '@/themes/dark/RankingBanner';
import RankingBannerLight from '@/themes/light/RankingBanner';

const RankingBanner = () => {
  const theme = useThemeStore((s) => s.theme);
  return theme === 'light' ? <RankingBannerLight /> : <RankingBannerDark />;
};

export default RankingBanner;
