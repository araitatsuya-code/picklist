import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ColorTheme } from '../styles/theme';

interface ThemeState {
  // テーマの状態
  theme: ColorTheme;
  // システム設定に従うかどうか
  followSystem: boolean;
  // テーマの変更関数
  setTheme: (theme: ColorTheme) => void;
  // システム設定に従うかどうかの変更関数
  setFollowSystem: (follow: boolean) => void;
}

// テーマストアの作成
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light', // デフォルトはライトモード
      followSystem: true, // デフォルトではシステム設定に従う

      // テーマを設定する関数
      setTheme: (theme: ColorTheme) => set({ theme }),

      // システム設定に従うかどうかを設定する関数
      setFollowSystem: (followSystem: boolean) => set({ followSystem }),
    }),
    {
      name: 'theme-storage', // AsyncStorageのキー
      storage: createJSONStorage(() => AsyncStorage), // AsyncStorageを使用
    }
  )
);
