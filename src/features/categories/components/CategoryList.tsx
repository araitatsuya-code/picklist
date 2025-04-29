import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { CategoryItem } from './CategoryItem';
import type { Category } from '../../../stores/useCategoryStore';
import { CategoryColors } from '../types';

interface CategoryListProps {
  sortedCategories: Category[];
  updateCategory: (id: string, data: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  onMoveCategory: (category: Category, direction: 'up' | 'down') => void;
  colors: CategoryColors;
  isDark: boolean;
  textColor: string;
  secondaryTextColor: string;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  sortedCategories,
  updateCategory,
  removeCategory,
  onMoveCategory,
  colors,
  isDark,
  textColor,
  secondaryTextColor,
}) => {
  return (
    <FlatList
      data={sortedCategories}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <CategoryItem
          category={item}
          updateCategory={updateCategory}
          removeCategory={removeCategory}
          isRemovable={item.id !== 'other'}
          colors={colors}
          isDark={isDark}
          textColor={textColor}
          secondaryTextColor={secondaryTextColor}
          isFirst={index === 0}
          isLast={index === sortedCategories.length - 1}
          onMove={(direction) => onMoveCategory(item, direction)}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: 16,
  },
});
