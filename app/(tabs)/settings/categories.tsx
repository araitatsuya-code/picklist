import React from 'react';
import { Stack } from 'expo-router';
import { CategoryManagement } from '../../../src/components/CategoryManagement';

export default function CategoriesScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'カテゴリ管理',
          headerLargeTitle: true,
        }}
      />
      <CategoryManagement />
    </>
  );
}
