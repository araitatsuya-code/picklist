import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from './ThemeProvider';

interface HistorySearchFilterProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  sortBy: 'date' | 'name' | 'completion';
  onSortChange: (sortBy: 'date' | 'name' | 'completion') => void;
  sortDirection: 'asc' | 'desc';
  onSortDirectionChange: (direction: 'asc' | 'desc') => void;
}

export const HistorySearchFilter: React.FC<HistorySearchFilterProps> = ({
  searchText,
  onSearchChange,
  sortBy,
  onSortChange,
  sortDirection,
  onSortDirectionChange,
}) => {
  const { colors } = useThemeContext();
  const [showSortOptions, setShowSortOptions] = useState(false);

  const getSortLabel = () => {
    const labels = {
      date: '日付',
      name: 'リスト名',
      completion: '完了率',
    };
    return labels[sortBy];
  };

  const handleSortOptionPress = (option: 'date' | 'name' | 'completion') => {
    if (sortBy === option) {
      // 同じソート項目の場合は順序を切り替え
      onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 異なるソート項目の場合は新しい項目を設定
      onSortChange(option);
      onSortDirectionChange('desc'); // デフォルトは降順
    }
    setShowSortOptions(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* 検索バー */}
      <View style={[styles.searchContainer, { borderColor: colors.border.primary }]}>
        <Ionicons name="search" size={20} color={colors.text.tertiary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text.primary }]}
          value={searchText}
          onChangeText={onSearchChange}
          placeholder="リスト名で検索"
          placeholderTextColor={colors.text.tertiary}
        />
        {searchText.length > 0 && (
          <Pressable onPress={() => onSearchChange('')}>
            <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
          </Pressable>
        )}
      </View>

      {/* ソートオプション */}
      <View style={styles.sortContainer}>
        <Pressable
          style={[styles.sortButton, { borderColor: colors.border.primary }]}
          onPress={() => setShowSortOptions(!showSortOptions)}
        >
          <Text style={[styles.sortText, { color: colors.text.primary }]}>
            {getSortLabel()}
          </Text>
          <Ionicons
            name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
            size={16}
            color={colors.text.secondary}
          />
          <Ionicons
            name={showSortOptions ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.text.secondary}
          />
        </Pressable>

        {/* ソートオプションドロップダウン */}
        {showSortOptions && (
          <View style={[styles.sortOptions, { 
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }]}>
            <Pressable
              style={[styles.sortOption, sortBy === 'date' && { backgroundColor: colors.accent.primary + '20' }]}
              onPress={() => handleSortOptionPress('date')}
            >
              <Text style={[styles.sortOptionText, { color: colors.text.primary }]}>
                日付
              </Text>
              {sortBy === 'date' && (
                <Ionicons
                  name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                  size={16}
                  color={colors.accent.primary}
                />
              )}
            </Pressable>
            
            <Pressable
              style={[styles.sortOption, sortBy === 'name' && { backgroundColor: colors.accent.primary + '20' }]}
              onPress={() => handleSortOptionPress('name')}
            >
              <Text style={[styles.sortOptionText, { color: colors.text.primary }]}>
                リスト名
              </Text>
              {sortBy === 'name' && (
                <Ionicons
                  name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                  size={16}
                  color={colors.accent.primary}
                />
              )}
            </Pressable>
            
            <Pressable
              style={[styles.sortOption, sortBy === 'completion' && { backgroundColor: colors.accent.primary + '20' }]}
              onPress={() => handleSortOptionPress('completion')}
            >
              <Text style={[styles.sortOptionText, { color: colors.text.primary }]}>
                完了率
              </Text>
              {sortBy === 'completion' && (
                <Ionicons
                  name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                  size={16}
                  color={colors.accent.primary}
                />
              )}
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sortContainer: {
    position: 'relative',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
    minWidth: 100,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortOptions: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 120,
    zIndex: 1000,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sortOptionText: {
    fontSize: 14,
  },
});