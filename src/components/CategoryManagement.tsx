import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  Text,
  Card,
  Button,
  IconButton,
  TextInput,
  List,
} from 'react-native-paper';
import { useCategoryStore } from '../stores/useCategoryStore';
import { Category } from '../stores/useCategoryStore';
import { useTheme } from '../hooks/useTheme';

export const CategoryManagement: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { categories, addCategory, updateCategory, removeCategory } =
    useCategoryStore();
  const [newCategoryName, setNewCategoryName] = useState('');

  // テキスト色の設定 - ダークモード時は白っぽく
  const textColor = isDark ? '#FFFFFF' : colors.text.primary;
  const secondaryTextColor = isDark ? '#E0E0E0' : colors.text.secondary;

  // 新しいカテゴリを追加
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      // 使用可能な次の優先度を見つける
      const usedPriorities = categories.map((c) => c.priority);
      let newPriority = 1;
      while (usedPriorities.includes(newPriority)) {
        newPriority++;
      }

      addCategory({
        name: newCategoryName,
        displayOrder: categories.length + 1,
        priority: newPriority,
      });
      setNewCategoryName('');
    }
  };

  // 優先度の上下を処理
  const handleMoveCategory = (category: Category, direction: 'up' | 'down') => {
    // 並び替えられたカテゴリリストを取得
    const sorted = [...categories].sort((a, b) => a.priority - b.priority);

    // 現在のカテゴリのインデックスを見つける
    const currentIndex = sorted.findIndex((c) => c.id === category.id);

    if (direction === 'up' && currentIndex > 0) {
      // 上に移動：前のカテゴリと優先度を交換
      const prevCategory = sorted[currentIndex - 1];
      updateCategory(category.id, { priority: prevCategory.priority });
      updateCategory(prevCategory.id, { priority: category.priority });
    } else if (direction === 'down' && currentIndex < sorted.length - 1) {
      // 下に移動：次のカテゴリと優先度を交換
      const nextCategory = sorted[currentIndex + 1];
      updateCategory(category.id, { priority: nextCategory.priority });
      updateCategory(nextCategory.id, { priority: category.priority });
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
            onChangeText={setNewCategoryName}
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

      {/* カテゴリリスト - シンプルなリスト表示 */}
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
            onMove={(direction) => handleMoveCategory(item, direction)}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

interface CategoryItemProps {
  category: Category;
  updateCategory: (id: string, data: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  isRemovable: boolean;
  colors: {
    accent: {
      primary: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
    background: {
      primary: string;
    };
    border: {
      primary: string;
    };
    state: {
      error: string;
    };
  };
  isDark: boolean;
  textColor: string;
  secondaryTextColor: string;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: 'up' | 'down') => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  updateCategory,
  removeCategory,
  isRemovable,
  colors,
  isDark,
  textColor,
  secondaryTextColor,
  isFirst,
  isLast,
  onMove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);

  const handleUpdate = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      // 空の名前の場合は元の名前に戻す
      setName(category.name);
      setIsEditing(false);
      return;
    }
    updateCategory(category.id, { name: trimmedName });
    setIsEditing(false);
  };

  return (
    <List.Item
      title={
        isEditing ? (
          <TextInput
            value={name}
            onChangeText={setName}
            mode="flat"
            style={styles.editInput}
            onBlur={handleUpdate}
            autoFocus
            textColor={textColor}
            theme={{
              colors: {
                primary: colors.accent.primary,
                placeholder: secondaryTextColor,
                background: 'transparent',
              },
            }}
          />
        ) : (
          <Text style={{ color: textColor }}>{category.name}</Text>
        )
      }
      description={() => (
        <Text style={{ color: secondaryTextColor }}>
          優先度: {category.priority}
        </Text>
      )}
      left={() => (
        <View style={styles.priorityButtons}>
          <IconButton
            icon="arrow-up"
            size={20}
            onPress={() => onMove('up')}
            iconColor={isDark ? '#FFFFFF' : colors.text.primary}
            disabled={isFirst}
          />
          <IconButton
            icon="arrow-down"
            size={20}
            onPress={() => onMove('down')}
            iconColor={isDark ? '#FFFFFF' : colors.text.primary}
            disabled={isLast}
          />
        </View>
      )}
      right={() => (
        <View style={styles.actionButtons}>
          <IconButton
            icon={isEditing ? 'check' : 'pencil'}
            size={20}
            onPress={() => (isEditing ? handleUpdate() : setIsEditing(true))}
            iconColor={isDark ? '#FFFFFF' : colors.text.secondary}
          />
          {isRemovable && (
            <IconButton
              icon="delete"
              size={20}
              onPress={() => removeCategory(category.id)}
              iconColor={isDark ? '#FF5252' : colors.state.error}
            />
          )}
        </View>
      )}
      style={[
        styles.categoryItem,
        {
          backgroundColor: isDark ? '#2C2C2C' : colors.background.primary,
          borderColor: isDark ? '#444444' : colors.border.primary,
          borderWidth: 1,
        },
      ]}
      titleStyle={{ color: textColor }}
      descriptionStyle={{ color: secondaryTextColor }}
    />
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
  list: {
    paddingBottom: 16,
  },
  categoryItem: {
    marginBottom: 8,
    borderRadius: 4,
    elevation: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityButtons: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  editInput: {
    height: 40,
    backgroundColor: 'transparent',
  },
});
