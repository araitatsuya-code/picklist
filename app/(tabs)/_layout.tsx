import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';

type IconName =
  | 'cart-outline'
  | 'list-outline'
  | 'calendar-outline'
  | 'settings-outline'
  | 'grid-outline';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const renderTabBarIcon = (
    name: IconName,
    color: string,
    focused: boolean
  ) => (
    <View style={{ alignItems: 'center' }}>
      <Ionicons
        name={name}
        size={focused ? 28 : 24}
        color={color}
        style={{
          ...(focused &&
            Platform.select({
              ios: {
                shadowColor: color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              },
              android: {
                elevation: 8,
              },
            })),
        }}
      />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          height: 44 + insets.top,
          backgroundColor: colors.background.primary,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 4,
            },
          }),
        },
        headerTitleStyle: {
          color: colors.text.primary,
        },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.tabBar.active,
        tabBarInactiveTintColor: colors.tabBar.inactive,
        tabBarStyle: {
          height: 85 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
          backgroundColor: colors.tabBar.background,
          borderTopWidth: 0,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: isDark ? 0.4 : 0.15,
              shadowRadius: 8,
            },
            android: {
              elevation: 12,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 4,
          color: colors.text.primary,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '買い物リスト',
          tabBarIcon: ({ color, focused }) =>
            renderTabBarIcon('cart-outline', color, focused),
        }}
      />
      <Tabs.Screen
        name="frequent-products"
        options={{
          title: 'よく買う商品',
          tabBarIcon: ({ color, focused }) =>
            renderTabBarIcon('list-outline', color, focused),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '履歴',
          tabBarIcon: ({ color, focused }) =>
            renderTabBarIcon('calendar-outline', color, focused),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color, focused }) =>
            renderTabBarIcon('settings-outline', color, focused),
        }}
      />
      <Tabs.Screen
        name="settings/categories"
        options={{
          title: 'カテゴリー',
          tabBarIcon: ({ color, focused }) =>
            renderTabBarIcon('grid-outline', color, focused),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
