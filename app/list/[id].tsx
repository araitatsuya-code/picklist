import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { usePicklistStore } from '../../src/stores/usePicklistStore';
import { Ionicons } from '@expo/vector-icons';

/**
 * 個別の買い物リスト画面
 * リストの詳細表示と編集機能を提供
 */
export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [editMode, setEditMode] = useState(false);
  const [listName, setListName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { picklists, updatePicklist, toggleItemCompletion, removeItem, removePicklist } =
    usePicklistStore();

  const list = useMemo(
    () => picklists.find((l) => l.id === id),
    [picklists, id]
  );

  if (!list) {
    router.back();
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
    router.replace('/lists');  // リスト一覧画面に戻る
  };

  return (
    <View style={styles.container}>
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

            <Pressable
              style={styles.deleteButton}
              onPress={() => handleRemoveItem(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </Pressable>
          </View>
        )}
      />

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
});
