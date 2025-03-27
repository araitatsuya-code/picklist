import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Text } from 'react-native-paper';
import { usePicklistStore } from '../stores/usePicklistStore';
import { useCategoryStore, Category } from '../stores/useCategoryStore';
import {
  sortByCategory,
  sortByPriority,
  sortByName,
  groupAndSortByCategory,
} from '../utils/sortUtils';
import { PicklistItem } from '../stores/usePicklistStore';

interface GroupedPicklistItemsProps {
  listId: string;
  onItemPress?: (item: PicklistItem) => void;
}

type ItemGroup = {
  category?: Category;
  items: PicklistItem[];
};

export const GroupedPicklistItems: React.FC<GroupedPicklistItemsProps> = ({
  listId,
  onItemPress,
}) => {
  const { picklists } = usePicklistStore();
  const { categories } = useCategoryStore();
  const currentList = picklists.find((list) => list.id === listId);

  const sortedItems = useMemo<ItemGroup[]>(() => {
    if (!currentList) return [];

    const { items, sortBy = 'category', groupByCategory = true } = currentList;

    if (groupByCategory && sortBy === 'category') {
      return groupAndSortByCategory(items, categories);
    }

    switch (sortBy) {
      case 'category':
        return [{ items: sortByCategory(items, categories) }] as ItemGroup[];
      case 'priority':
        return [{ items: sortByPriority(items) }] as ItemGroup[];
      case 'name':
        return [{ items: sortByName(items) }] as ItemGroup[];
      default:
        return [{ items }] as ItemGroup[];
    }
  }, [currentList, categories]);

  if (!currentList) return null;

  const renderItem = (item: PicklistItem) => {
    const priorityLabels = ['高', '中', '低'];
    const category = categories.find((c) => c.id === item.category);

    return (
      <List.Item
        key={item.id}
        title={item.name}
        description={`${item.quantity}${item.unit || '個'} ${
          category ? `/ ${category.name}` : ''
        }`}
        left={(props) => (
          <List.Icon
            {...props}
            icon={item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
          />
        )}
        right={(props) => (
          <Text {...props} style={styles.priorityText}>
            優先度: {priorityLabels[item.priority - 1]}
          </Text>
        )}
        onPress={() => onItemPress?.(item)}
        style={[styles.listItem, item.completed && styles.completedItem]}
      />
    );
  };

  return (
    <View style={styles.container}>
      {sortedItems.map((group, index) => (
        <View key={group.category?.id || `uncategorized-${index}`}>
          {group.category ? (
            <Text style={styles.categoryName}>{group.category.name}</Text>
          ) : null}
          {group.items.map(renderItem)}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    backgroundColor: 'white',
  },
  completedItem: {
    opacity: 0.6,
  },
  categoryHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  priorityText: {
    fontSize: 12,
    color: '#666',
  },
  categoryName: {
    fontWeight: 'bold',
  },
});
