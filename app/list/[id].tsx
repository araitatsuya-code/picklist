import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { usePicklistStore } from '../../src/stores/usePicklistStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

/**
 * 個別の買い物リスト画面
 * リストの詳細表示と編集機能を提供
 */
export default function ListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [newItemName, setNewItemName] = useState('');

  // Zustandストアからデータとアクションを取得
  const picklist = usePicklistStore((state) =>
    state.picklists.find((list) => list.id === id)
  );
  const { addItem, removeItem, toggleItem } = usePicklistStore();

  // リストが見つからない場合
  if (!picklist) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>リストが見つかりません</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>戻る</Text>
        </Pressable>
      </View>
    );
  }

  // 新しいアイテムを追加
  const handleAddItem = () => {
    if (newItemName.trim()) {
      addItem(id, {
        name: newItemName.trim(),
        quantity: 1,
        unit: '個',
        isChecked: false,
      });
      setNewItemName('');
    }
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.title}>{picklist.name}</Text>
      </View>

      {/* 新規アイテム追加フォーム */}
      <View style={styles.addForm}>
        <TextInput
          style={styles.input}
          value={newItemName}
          onChangeText={setNewItemName}
          placeholder="新しいアイテムを追加"
          onSubmitEditing={handleAddItem}
        />
        <Pressable style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.addButtonText}>追加</Text>
        </Pressable>
      </View>

      {/* アイテムリスト */}
      <View style={styles.listContainer}>
        {picklist.items.length === 0 ? (
          <Text style={styles.emptyText}>アイテムを追加してください</Text>
        ) : (
          picklist.items
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Pressable
                  style={styles.checkbox}
                  onPress={() => toggleItem(id, item.id)}
                >
                  <Text>{item.isChecked ? '☑' : '☐'}</Text>
                </Pressable>
                <Text
                  style={[
                    styles.itemName,
                    item.isChecked && styles.checkedItem,
                  ]}
                >
                  {item.name}
                </Text>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => removeItem(id, item.id)}
                >
                  <Text style={styles.deleteButtonText}>削除</Text>
                </Pressable>
              </View>
            ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: '#3b82f6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addForm: {
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 24,
  },
  errorText: {
    textAlign: 'center',
    color: '#ef4444',
    marginTop: 24,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  checkbox: {
    marginRight: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
  },
  checkedItem: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  deleteButton: {
    marginLeft: 8,
    padding: 4,
  },
  deleteButtonText: {
    color: '#ef4444',
  },
});
