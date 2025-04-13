// ライトテーマとダークテーマのカラートークンを定義

export type ColorTheme = 'light' | 'dark';

export interface ThemeColors {
  // 背景色
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  // テキスト色
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  // ボーダー色
  border: {
    primary: string;
    secondary: string;
  };
  // アクセント色
  accent: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  // 状態色
  state: {
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  // コントロール色
  control: {
    active: string;
    inactive: string;
  };
  // カード色
  card: {
    background: string;
    shadow: string;
  };
  // タブバー色
  tabBar: {
    active: string;
    inactive: string;
    background: string;
  };
  // その他
  statusBar: string;
  shadow: string;
}

// ライトテーマのカラー
export const lightTheme: ThemeColors = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#F0F0F0',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#FFFFFF',
  },
  border: {
    primary: '#E5E7EB',
    secondary: '#EEEEEE',
  },
  accent: {
    primary: '#007AFF',
    secondary: '#F0F9FF',
    tertiary: '#FFE8E8',
  },
  state: {
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FFCC00',
    info: '#5AC8FA',
  },
  control: {
    active: '#007AFF',
    inactive: '#8E8E93',
  },
  card: {
    background: '#FFFFFF',
    shadow: '#000000',
  },
  tabBar: {
    active: '#007AFF',
    inactive: '#8E8E93',
    background: '#FFFFFF',
  },
  statusBar: 'dark',
  shadow: '#000000',
};

// ダークテーマのカラー
export const darkTheme: ThemeColors = {
  background: {
    primary: '#1C1C1E',
    secondary: '#2C2C2E',
    tertiary: '#3A3A3C',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#EBEBF5',
    tertiary: '#EBEBF599', // 60% opacity
    inverse: '#1A1A1A',
  },
  border: {
    primary: '#38383A',
    secondary: '#3A3A3C',
  },
  accent: {
    primary: '#0A84FF',
    secondary: '#1C2A3B',
    tertiary: '#3B2A2A',
  },
  state: {
    success: '#30D158',
    error: '#FF453A',
    warning: '#FFD60A',
    info: '#64D2FF',
  },
  control: {
    active: '#0A84FF',
    inactive: '#98989D',
  },
  card: {
    background: '#2C2C2E',
    shadow: '#000000',
  },
  tabBar: {
    active: '#0A84FF',
    inactive: '#98989D',
    background: '#1C1C1E',
  },
  statusBar: 'light',
  shadow: '#000000',
};

// テーマカラーの取得
export const getThemeColors = (theme: ColorTheme): ThemeColors => {
  return theme === 'light' ? lightTheme : darkTheme;
};
