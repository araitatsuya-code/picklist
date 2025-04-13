import { Stack } from 'expo-router';
import { useThemeContext } from '../../../src/components/ThemeProvider';

export default function ListLayout() {
  const { colors } = useThemeContext();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          color: colors.text.primary,
        },
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: '買い物リストの詳細',
          headerBackTitle: '戻る',
        }}
      />
    </Stack>
  );
}
