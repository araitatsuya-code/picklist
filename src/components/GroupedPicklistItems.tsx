import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { usePicklistStore } from '../stores/usePicklistStore';
import { useCategoryStore } from '../stores/useCategoryStore';
import {
  sortByCategory,
  sortByPriority,
  sortByName,
  groupAndSortByCategory,
  sortByCreated,
} from '../utils/sortUtils';
import { PicklistItem } from '../stores/usePicklistStore';
import { Ionicons } from '@expo/vector-icons';

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

    const {
      items,
      sortBy = 'category',
      sortDirection = 'asc',
      groupByCategory = true,
    } = currentList;

    console.log('Debug - Categories:', categories);
    console.log(
      'Debug - Items with categories:',
      items.map((item) => ({
        name: item.name,
        category: item.category,
        categoryName: categories.find((c) => c.id === item.category)?.name,
      }))
    );

    if (groupByCategory && sortBy === 'category') {
      return groupAndSortByCategory(items, categories, sortDirection);
    }

    switch (sortBy) {
      case 'category':
        return [
          { items: sortByCategory(items, categories, sortDirection) },
        ] as ItemGroup[];
      case 'priority':
        return [{ items: sortByPriority(items, sortDirection) }] as ItemGroup[];
      case 'name':
        return [{ items: sortByName(items, sortDirection) }] as ItemGroup[];
      case 'created':
        return [{ items: sortByCreated(items, sortDirection) }] as ItemGroup[];
      default:
        return [{ items }] as ItemGroup[];
    }
  }, [currentList, categories]);

  if (!currentList) return null;

  const renderItem = (item: PicklistItem) => (
    <Pressable
      key={item.id}
      style={styles.itemContainer}
      onPress={() => onItemPress?.(item)}
    >
      <Ionicons
        name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={item.completed ? '#007AFF' : '#666'}
      />
      <View style={styles.itemInfo}>
        <Text
          style={[styles.itemName, item.completed && styles.itemNameCompleted]}
        >
          {item.name}
        </Text>
        <Text style={styles.itemQuantity}>
          {item.quantity} {item.unit || '個'}
        </Text>
      </View>
    </Pressable>
  );

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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: 8,
  },
});
