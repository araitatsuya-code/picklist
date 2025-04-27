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
      addCategory({
        name: newCategoryName,
        displayOrder: categories.length + 1,
        priority: categories.length + 1,
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
        renderItem={({ item }) => (
          <CategoryItem
            category={item}
            updateCategory={updateCategory}
            removeCategory={removeCategory}
            isRemovable={item.id !== 'other'}
            colors={colors}
            isDark={isDark}
            textColor={textColor}
            secondaryTextColor={secondaryTextColor}
            categoriesLength={sortedCategories.length}
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
  categoriesLength: number;
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
  categoriesLength,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);

  const handleUpdate = () => {
    updateCategory(category.id, { name });
    setIsEditing(false);
  };

  const moveUp = () => {
    updateCategory(category.id, {
      priority: Math.max(1, category.priority - 1),
    });
  };

  const moveDown = () => {
    updateCategory(category.id, {
      priority: Math.min(category.priority + 1, categoriesLength),
    });
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
            onPress={moveUp}
            iconColor={isDark ? '#FFFFFF' : colors.text.primary}
          />
          <IconButton
            icon="arrow-down"
            size={20}
            onPress={moveDown}
            iconColor={isDark ? '#FFFFFF' : colors.text.primary}
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
