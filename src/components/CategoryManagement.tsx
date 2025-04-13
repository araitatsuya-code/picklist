import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  List,
  IconButton,
  Button,
  TextInput,
  Portal,
  Dialog,
} from 'react-native-paper';
import { useCategoryStore } from '../stores/useCategoryStore';
import { Category } from '../stores/useCategoryStore';
import { useThemeContext } from './ThemeProvider';

export const CategoryManagement: React.FC = () => {
  const { colors, isDark } = useThemeContext();
  const { categories, addCategory, updateCategory, removeCategory } =
    useCategoryStore();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('');

  const handleSave = () => {
    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name,
        priority: Number(priority),
      });
    } else {
      addCategory({
        name,
        displayOrder: categories.length + 1,
        priority: Number(priority) || categories.length + 1,
      });
    }
    setDialogVisible(false);
    setEditingCategory(null);
    setName('');
    setPriority('');
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setPriority(category.priority.toString());
    setDialogVisible(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setName('');
    setPriority('');
    setDialogVisible(true);
  };

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
      <ScrollView>
        {sortedCategories.map((category) => (
          <List.Item
            key={category.id}
            title={category.name}
            titleStyle={{ color: colors.text.primary }}
            description={`優先度: ${category.priority}`}
            descriptionStyle={{ color: colors.text.secondary }}
            style={[
              styles.listItem,
              {
                backgroundColor: colors.background.primary,
                borderBottomColor: colors.border.secondary,
              },
            ]}
            right={(props) => (
              <View style={styles.actions}>
                <IconButton
                  {...props}
                  icon="pencil"
                  onPress={() => handleEdit(category)}
                  iconColor={colors.text.secondary}
                />
                {category.id !== 'other' && (
                  <IconButton
                    {...props}
                    icon="delete"
                    iconColor={colors.state.error}
                    onPress={() => removeCategory(category.id)}
                  />
                )}
              </View>
            )}
          />
        ))}
      </ScrollView>

      <Button
        mode="contained"
        onPress={handleAdd}
        style={styles.addButton}
        buttonColor={colors.accent.primary}
        textColor={colors.text.inverse}
      >
        カテゴリを追加
      </Button>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={{
            backgroundColor: isDark ? '#f5f5f5' : colors.background.primary,
          }}
        >
          <Dialog.Title
            style={{ color: isDark ? '#000000' : colors.text.primary }}
          >
            {editingCategory ? 'カテゴリを編集' : 'カテゴリを追加'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="カテゴリ名"
              value={name}
              onChangeText={setName}
              style={styles.input}
              textColor={isDark ? '#000000' : colors.text.primary}
              theme={{
                colors: {
                  primary: colors.accent.primary,
                  background: isDark ? '#f5f5f5' : colors.background.primary,
                  placeholder: isDark ? '#666666' : colors.text.secondary,
                  text: isDark ? '#000000' : colors.text.primary,
                },
              }}
              underlineColor={isDark ? '#cccccc' : colors.border.primary}
              activeUnderlineColor={colors.accent.primary}
            />
            <TextInput
              label="優先度（小さい数字ほど上に表示）"
              value={priority}
              onChangeText={setPriority}
              keyboardType="numeric"
              style={styles.input}
              textColor={isDark ? '#000000' : colors.text.primary}
              theme={{
                colors: {
                  primary: colors.accent.primary,
                  background: isDark ? '#f5f5f5' : colors.background.primary,
                  placeholder: isDark ? '#666666' : colors.text.secondary,
                  text: isDark ? '#000000' : colors.text.primary,
                },
              }}
              underlineColor={isDark ? '#cccccc' : colors.border.primary}
              activeUnderlineColor={colors.accent.primary}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setDialogVisible(false)}
              textColor={isDark ? '#666666' : colors.text.secondary}
            >
              キャンセル
            </Button>
            <Button
              onPress={handleSave}
              disabled={!name || !priority}
              textColor={colors.accent.primary}
            >
              保存
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    borderBottomWidth: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  addButton: {
    margin: 16,
  },
  input: {
    marginTop: 8,
  },
});
