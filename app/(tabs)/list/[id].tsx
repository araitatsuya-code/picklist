import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  PicklistItem,
  usePicklistStore,
} from '../../../src/stores/usePicklistStore';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [editMode, setEditMode] = useState(false);
  const [listName, setListName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    quantity: string;
    maxPrice: string;
    note: string;
  } | null>(null);

  const {
    picklists,
    updatePicklist,
    toggleItemCompletion,
    removeItem,
    removePicklist,
    updateItem,
  } = usePicklistStore();

  const list = useMemo(
    () => picklists.find((l) => l.id === id),
    [picklists, id]
  );

  if (!list) {
    router.replace('/(tabs)');
    return null;
  }

  const handleToggleComplete = (itemId: string) => {
    toggleItemCompletion(id, itemId);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(id, itemId);
  };

  const handleSaveListName = () => {
    if (listName.trim()) {
      updatePicklist(id, { name: listName.trim() });
      setEditMode(false);
    }
  };

  const handleDeleteList = () => {
    removePicklist(id);
    router.replace('/(tabs)');
  };

  const handleEditItem = (item: PicklistItem) => {
    setEditingItem({
      id: item.id,
      quantity: item.quantity.toString(),
      maxPrice: item.maxPrice?.toString() || '',
      note: item.note || '',
    });
  };

  const handleSaveItem = () => {
    if (!editingItem) return;

    updateItem(id, editingItem.id, {
      quantity: Number(editingItem.quantity) || 1,
      maxPrice: editingItem.maxPrice ? Number(editingItem.maxPrice) : undefined,
      note: editingItem.note || undefined,
    });
    setEditingItem(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {editMode ? (
              <View style={styles.editNameContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={listName}
                  onChangeText={setListName}
                  placeholder="リスト名を入力"
                  autoFocus
                />
                <Pressable
                  style={styles.saveButton}
                  onPress={handleSaveListName}
                >
                  <Text style={styles.saveButtonText}>保存</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.titleContainer}
                onPress={() => {
                  setListName(list.name);
                  setEditMode(true);
                }}
              >
                <Text style={styles.title}>{list.name}</Text>
                <Ionicons name="pencil" size={20} color="#666" />
              </Pressable>
            )}

            <Pressable
              style={styles.deleteListButton}
              onPress={() => setShowDeleteConfirm(true)}
            >
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            </Pressable>
          </View>
        </View>

        {/* クイック追加フォーム */}
        <View style={styles.quickAdd}>
          <TextInput
            style={styles.quickAddInput}
            placeholder="商品名を入力して追加"
            ref={(input) => {
              if (input) {
                // @ts-expect-error TextInput型の定義にclear()メソッドが含まれていないため
                this.quickAddInput = input;
              }
            }}
            onSubmitEditing={(event) => {
              const name = event.nativeEvent.text.trim();
              if (name) {
                updatePicklist(id, {
                  items: [
                    ...list.items,
                    {
                      id: Crypto.randomUUID(),
                      productId: Crypto.randomUUID(),
                      name,
                      quantity: 1,
                      completed: false,
                    },
                  ],
                });
                // @ts-expect-error TextInput型の定義にclear()メソッドが含まれていないため
                this.quickAddInput?.clear();
              }
            }}
            returnKeyType="done"
          />
        </View>

        <FlatList
          data={list.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Pressable
                style={styles.checkbox}
                onPress={() => handleToggleComplete(item.id)}
              >
                <Ionicons
                  name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={item.completed ? '#007AFF' : '#666'}
                />
              </Pressable>

              <View style={styles.itemInfo}>
                <Text
                  style={[
                    styles.itemName,
                    item.completed && styles.itemNameCompleted,
                  ]}
                >
                  {item.name}
                </Text>
                <Text style={styles.itemQuantity}>
                  {item.quantity} {item.unit || '個'}
                  {item.maxPrice && ` (${item.maxPrice}円まで)`}
                </Text>
                {item.note && <Text style={styles.itemNote}>{item.note}</Text>}
              </View>

              <View style={styles.itemActions}>
                <Pressable
                  style={styles.editButton}
                  onPress={() => handleEditItem(item)}
                >
                  <Ionicons name="pencil-outline" size={20} color="#007AFF" />
                </Pressable>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </Pressable>
              </View>
            </View>
          )}
        />

        {/* アイテム編集モーダル */}
        {editingItem && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>アイテムを編集</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>数量</Text>
                <TextInput
                  style={styles.input}
                  value={editingItem.quantity}
                  onChangeText={(text) =>
                    setEditingItem({ ...editingItem, quantity: text })
                  }
                  keyboardType="numeric"
                  placeholder="数量を入力"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>価格上限</Text>
                <TextInput
                  style={styles.input}
                  value={editingItem.maxPrice}
                  onChangeText={(text) =>
                    setEditingItem({ ...editingItem, maxPrice: text })
                  }
                  keyboardType="numeric"
                  placeholder="任意"
                />
                <Text style={styles.unit}>円</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>メモ</Text>
                <TextInput
                  style={[styles.input, styles.noteInput]}
                  value={editingItem.note}
                  onChangeText={(text) =>
                    setEditingItem({ ...editingItem, note: text })
                  }
                  placeholder="任意"
                  multiline
                />
              </View>

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => setEditingItem(null)}
                >
                  <Text style={styles.modalCancelButtonText}>キャンセル</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.modalSaveButton]}
                  onPress={handleSaveItem}
                >
                  <Text style={styles.modalSaveButtonText}>保存</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* 削除確認モーダル */}
        {showDeleteConfirm && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>買い物リストを削除</Text>
              <Text style={styles.modalMessage}>
                「{list.name}」を削除してもよろしいですか？
                {'\n'}この操作は取り消せません。
              </Text>
              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => setShowDeleteConfirm(false)}
                >
                  <Text style={styles.modalCancelButtonText}>キャンセル</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.modalDeleteButton]}
                  onPress={handleDeleteList}
                >
                  <Text style={styles.modalDeleteButtonText}>削除</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* 追加ボタン */}
        <Pressable
          style={styles.fab}
          onPress={() => router.push('/(products)/add-to-list?selectedIds=')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkbox: {
    marginRight: 12,
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
  itemNote: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  deleteListButton: {
    padding: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalCancelButton: {
    backgroundColor: '#f0f0f0',
  },
  modalDeleteButton: {
    backgroundColor: '#FF3B30',
  },
  modalCancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  modalDeleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    flex: 1,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  unit: {
    marginLeft: 8,
  },
  noteInput: {
    flex: 1,
    height: 80,
    padding: 12,
  },
  modalSaveButton: {
    backgroundColor: '#007AFF',
  },
  modalSaveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    // iOSのシャドウ
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Androidのシャドウ
    elevation: 5,
  },
  quickAdd: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  quickAddInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
});
