import React from 'react';
import { Stack } from 'expo-router';
import { CategoryManagement } from '../../../src/components/CategoryManagement';
import { useThemeContext } from '../../../src/components/ThemeProvider';

export default function CategoriesScreen() {
  const { colors } = useThemeContext();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'カテゴリ管理',
          headerLargeTitle: true,
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTitleStyle: {
            color: colors.text.primary,
          },
          headerLargeTitleStyle: {
            color: colors.text.primary,
          },
        }}
      />
      <CategoryManagement />
    </>
  );
}
