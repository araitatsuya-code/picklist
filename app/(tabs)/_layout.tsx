import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View } from 'react-native';

type IconName = 'cart-outline' | 'list-outline' | 'settings-outline';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

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
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 4,
            },
          }),
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          height: 80 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          backgroundColor: '#FFF',
          borderTopWidth: 0,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            },
            android: {
              elevation: 12,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 8,
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
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color, focused }) =>
            renderTabBarIcon('settings-outline', color, focused),
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
