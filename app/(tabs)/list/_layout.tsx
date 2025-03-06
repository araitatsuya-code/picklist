import { Stack } from 'expo-router';

export default function ListLayout() {
  return (
    <Stack>
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