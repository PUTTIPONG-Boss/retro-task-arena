import { useThemeStore } from '@/store/themeStore';
import RewardBannerDark from '@/themes/dark/RewardBanner';
import RewardBannerLight from '@/themes/light/RewardBanner';

const RewardBanner = () => {
  const theme = useThemeStore((s) => s.theme);
  return theme === 'light' ? <RewardBannerLight /> : <RewardBannerDark />;
};

export default RewardBanner;
