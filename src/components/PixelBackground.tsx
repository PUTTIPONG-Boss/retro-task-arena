import { useThemeStore } from '@/store/themeStore';
import PixelBackgroundDark from '@/themes/dark/PixelBackground';
import PixelBackgroundLight from '@/themes/light/PixelBackground';

const PixelBackground = () => {
  const theme = useThemeStore((s) => s.theme);
  return theme === 'light' ? <PixelBackgroundLight /> : <PixelBackgroundDark />;
};

export default PixelBackground;
