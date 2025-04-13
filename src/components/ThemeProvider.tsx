import React, { createContext, useContext, useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ThemeColors } from '../styles/theme';

// テーマコンテキストの型
interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
}

// テーマコンテキストの作成
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// テーマコンテキストを使用するためのフック
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

// テーマプロバイダーのプロパティ
interface ThemeProviderProps {
  children: React.ReactNode;
}

// テーマプロバイダーコンポーネント
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { colors, isDark, followSystem, setTheme } = useTheme();
  const systemColorScheme = useColorScheme();

  // システムカラースキームが変更された時にテーマを更新
  useEffect(() => {
    if (followSystem && systemColorScheme) {
      setTheme(systemColorScheme);
    }
  }, [systemColorScheme, followSystem, setTheme]);

  return (
    <ThemeContext.Provider value={{ colors, isDark }}>
      <StatusBar
        barStyle={
          colors.statusBar === 'dark' ? 'dark-content' : 'light-content'
        }
        backgroundColor={colors.background.primary}
      />
      {children}
    </ThemeContext.Provider>
  );
};
