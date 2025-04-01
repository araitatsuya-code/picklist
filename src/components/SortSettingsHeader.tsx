import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { usePicklistStore } from '../stores/usePicklistStore';

type Props = {
  listId: string;
  sortBy?: 'name' | 'category' | 'priority' | 'created';
  sortDirection?: 'asc' | 'desc';
  groupByCategory?: boolean;
};

export function SortSettingsHeader({
  listId,
  sortBy,
  sortDirection,
  groupByCategory,
}: Props) {
  const { updateListSortSettings } = usePicklistStore();

  const handleSortDirectionChange = () => {
    updateListSortSettings(
      listId,
      sortBy,
      sortDirection === 'asc' ? 'desc' : 'asc',
      groupByCategory
    );
  };

  const handleGroupByCategory = () => {
    updateListSortSettings(listId, sortBy, sortDirection, !groupByCategory);
  };

  return (
    <View style={styles.container}>
      <Button
        mode={sortDirection === 'asc' ? 'contained' : 'outlined'}
        onPress={handleSortDirectionChange}
        style={styles.directionButton}
      >
        {sortDirection === 'asc' ? '昇順' : '降順'}
      </Button>
      <Button
        mode={groupByCategory ? 'contained' : 'outlined'}
        onPress={handleGroupByCategory}
        style={styles.groupButton}
      >
        カテゴリでグループ化
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  directionButton: {
    flex: 1,
  },
  groupButton: {
    flex: 2,
  },
});
