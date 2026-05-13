import { useThemeStore } from '@/store/themeStore';
import GuildBannerDark from '@/themes/dark/GuildBanner';
import GuildBannerLight from '@/themes/light/GuildBanner';

const GuildBanner = () => {
  const theme = useThemeStore((s) => s.theme);
  return theme === 'light' ? <GuildBannerLight /> : <GuildBannerDark />;
};

export default GuildBanner;
