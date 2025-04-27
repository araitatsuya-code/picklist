import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Button, TextInput } from 'react-native-paper';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { useTheme } from '../../hooks/useTheme';
import { useCategoryManagement } from './hooks/useCategoryManagement';
import {
  findNextAvailablePriority,
  handleCategoryMove,
} from './utils/categoryUtils';
import { CategoryList } from './components/CategoryList';

export const CategoryManagement: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { categories, addCategory, updateCategory, removeCategory } =
    useCategoryStore();
  const { newCategoryName, setNewCategoryName, handleNameChange } =
    useCategoryManagement();

  // テキスト色の設定 - ダークモード時は白っぽく
  const textColor = isDark ? '#FFFFFF' : colors.text.primary;
  const secondaryTextColor = isDark ? '#E0E0E0' : colors.text.secondary;

  // 新しいカテゴリを追加
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newPriority = findNextAvailablePriority(categories);
      addCategory({
        name: newCategoryName,
        displayOrder: categories.length + 1,
        priority: newPriority,
      });
      setNewCategoryName('');
    }
  };

  // 並べ替えられたカテゴリリスト
  const sortedCategories = [...categories].sort(
    (a, b) => a.priority - b.priority
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background.secondary },
      ]}
    >
      {/* シンプルな入力フォーム */}
      <Card style={styles.inputCard}>
        <Card.Content style={styles.inputContainer}>
          <TextInput
            label="新しいカテゴリ名"
            value={newCategoryName}
            onChangeText={handleNameChange}
            style={styles.input}
            mode="outlined"
            textColor={textColor}
            theme={{
              colors: {
                primary: colors.accent.primary,
                placeholder: secondaryTextColor,
                background: colors.background.primary,
              },
            }}
          />
          <Button
            mode="contained"
            onPress={handleAddCategory}
            disabled={!newCategoryName.trim()}
            style={styles.addButton}
            buttonColor={colors.accent.primary}
            textColor={isDark ? '#FFFFFF' : colors.text.inverse}
          >
            追加
          </Button>
        </Card.Content>
      </Card>

      {/* カテゴリリスト */}
      <CategoryList
        sortedCategories={sortedCategories}
        updateCategory={updateCategory}
        removeCategory={removeCategory}
        onMoveCategory={(category, direction) =>
          handleCategoryMove(categories, category, direction, updateCategory)
        }
        colors={colors}
        isDark={isDark}
        textColor={textColor}
        secondaryTextColor={secondaryTextColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputCard: {
    marginBottom: 16,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    justifyContent: 'center',
  },
});
