import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, SegmentedButtons } from 'react-native-paper';
import { usePicklistStore } from '../stores/usePicklistStore';

interface SortSettingsHeaderProps {
  listId: string;
}

export const SortSettingsHeader: React.FC<SortSettingsHeaderProps> = ({
  listId,
}) => {
  const { picklists, updateListSortSettings } = usePicklistStore();
  const currentList = picklists.find((list) => list.id === listId);

  if (!currentList) return null;

  const { sortBy = 'category', groupByCategory = true } = currentList;

  const handleSortChange = (value: string) => {
    updateListSortSettings(
      listId,
      value as 'category' | 'priority' | 'name',
      groupByCategory
    );
  };

  const toggleGrouping = () => {
    updateListSortSettings(listId, sortBy, !groupByCategory);
  };

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={sortBy}
        onValueChange={handleSortChange}
        buttons={[
          { value: 'category', label: 'カテゴリ' },
          { value: 'priority', label: '優先度' },
          { value: 'name', label: '名前' },
        ]}
        style={styles.segmentedButtons}
      />
      <Button
        mode={groupByCategory ? 'contained' : 'outlined'}
        onPress={toggleGrouping}
        style={styles.groupButton}
      >
        グループ化
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  groupButton: {
    marginTop: 8,
  },
});
