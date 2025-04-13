import { useColorScheme } from 'react-native';
import { useThemeStore } from '../stores/useThemeStore';
import { ColorTheme, ThemeColors, getThemeColors } from '../styles/theme';

// テーマを使用するためのカスタムフック
export const useTheme = (): {
  theme: ColorTheme;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (theme: ColorTheme) => void;
  setFollowSystem: (follow: boolean) => void;
  followSystem: boolean;
} => {
  // システムのカラースキーム
  const systemColorScheme = useColorScheme();

  // テーマストアから状態と関数を取得
  const storeTheme = useThemeStore((state) => state.theme);
  const followSystem = useThemeStore((state) => state.followSystem);
  const setTheme = useThemeStore((state) => state.setTheme);
  const setFollowSystem = useThemeStore((state) => state.setFollowSystem);

  // 実際に使用するテーマ（システム設定を考慮）
  const currentTheme: ColorTheme = followSystem
    ? systemColorScheme === 'dark'
      ? 'dark'
      : 'light'
    : storeTheme;

  // 現在のテーマカラー
  const colors = getThemeColors(currentTheme);

  // ダークモードかどうか
  const isDark = currentTheme === 'dark';

  return {
    theme: currentTheme,
    colors,
    isDark,
    setTheme,
    setFollowSystem,
    followSystem,
  };
};
