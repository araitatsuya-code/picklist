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

export const CategoryManagement: React.FC = () => {
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
    <View style={styles.container}>
      <ScrollView>
        {sortedCategories.map((category) => (
          <List.Item
            key={category.id}
            title={category.name}
            description={`優先度: ${category.priority}`}
            style={styles.listItem}
            right={(props) => (
              <View style={styles.actions}>
                <IconButton
                  {...props}
                  icon="pencil"
                  onPress={() => handleEdit(category)}
                />
                {category.id !== 'other' && (
                  <IconButton
                    {...props}
                    icon="delete"
                    onPress={() => removeCategory(category.id)}
                  />
                )}
              </View>
            )}
          />
        ))}
      </ScrollView>

      <Button mode="contained" onPress={handleAdd} style={styles.addButton}>
        カテゴリを追加
      </Button>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>
            {editingCategory ? 'カテゴリを編集' : 'カテゴリを追加'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="カテゴリ名"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              label="優先度（小さい数字ほど上に表示）"
              value={priority}
              onChangeText={setPriority}
              keyboardType="numeric"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>キャンセル</Button>
            <Button onPress={handleSave} disabled={!name || !priority}>
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
    backgroundColor: '#f5f5f5',
  },
  listItem: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
