import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  usePicklistStore,
  PicklistItem,
} from '../../../src/stores/usePicklistStore';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import { IconButton, Menu } from 'react-native-paper';
import { GroupedPicklistItems } from '../../../src/components/GroupedPicklistItems';
import { useFrequentProductStore } from '../../../src/stores/useFrequentProductStore';
import { useTheme } from '../../../src/hooks/useTheme';
import { usePicklistCompletion } from '../../../src/hooks/usePicklistCompletion';

export default function ListDetailScreen() {
  const { colors, isDark } = useTheme();
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
  const quickAddInputRef = React.useRef<TextInput>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [noteModalItem, setNoteModalItem] = useState<PicklistItem | null>(null);

  const {
    picklists,
    updatePicklist,
    toggleItemCompletion,
    removePicklist,
    updateItem,
    updateListSortSettings,
  } = usePicklistStore();
  const { products } = useFrequentProductStore();
  const { completeList, getListStats } = usePicklistCompletion();

  const list = useMemo(
    () => picklists.find((l) => l.id === id),
    [picklists, id]
  );

  useEffect(() => {
    if (!list) {
      router.replace('/(tabs)');
    }
    setShowDeleteConfirm(false);
  }, [list]);

  if (!list) {
    return null;
  }

  const handleToggleComplete = (itemId: string) => {
    toggleItemCompletion(id, itemId);
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

  const handleCompleteList = () => {
    if (!list) return;
    
    const stats = getListStats(id);
    if (!stats) return;

    const message = stats.completionRate === 100 
      ? `「${list.name}」を完了します。\n履歴に保存され、リストが削除されます。`
      : `「${list.name}」を完了します。\n未完了のアイテム（${stats.remainingItems}個）がありますが、現在の状態で履歴に保存されます。`;

    Alert.alert(
      'リストを完了',
      message,
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '完了',
          style: 'default',
          onPress: () => {
            const success = completeList(id);
            if (success) {
              router.replace('/(tabs)');
            } else {
              Alert.alert('エラー', 'リストの完了に失敗しました。');
            }
          },
        },
      ]
    );
  };

  const handleSaveItem = () => {
    if (!editingItem) return;

    const currentItem = list.items.find((item) => item.id === editingItem.id);
    if (!currentItem) return;

    const updates: Partial<PicklistItem> = {
      quantity: Number(editingItem.quantity) || 1,
      maxPrice: editingItem.maxPrice ? Number(editingItem.maxPrice) : undefined,
      note: editingItem.note || undefined,
    };

    if (currentItem.category === 'none') {
      updates.priority = 1;
    }

    updateItem(id, editingItem.id, updates);
    setEditingItem(null);
  };

  const handleQuickAdd = (text: string) => {
    const name = text.trim();
    if (name) {
      // よく買う商品から同じ名前の商品を探す
      const frequentProduct = products.find(
        (product) => product.name.toLowerCase() === name.toLowerCase()
      );

      // 商品が見つかった場合はそのカテゴリを使用、見つからない場合はデフォルトカテゴリとして 'none' を使用
      const category = frequentProduct?.category || 'none';

      const priority = category === 'none' ? 1 : 2;

      updatePicklist(id, {
        items: [
          ...list.items,
          {
            id: Crypto.randomUUID(),
            productId: frequentProduct?.id || Crypto.randomUUID(),
            name,
            quantity: 1,
            priority,
            category,
            completed: false,
          },
        ],
      });
      quickAddInputRef.current?.clear();
    }
  };

  const handleSortChange = (
    sortBy: 'created' | 'name' | 'category' | 'priority',
    sortDirection: 'asc' | 'desc'
  ) => {
    if (id) {
      updateListSortSettings(id, sortBy, sortDirection);
    }
    setMenuVisible(false);
  };

  const handleRemoveItem = (item: PicklistItem) => {
    updatePicklist(id, {
      items: list.items.filter((i) => i.id !== item.id),
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.header,
            {
              borderBottomColor: colors.border.secondary,
              backgroundColor: colors.background.primary,
            },
          ]}
        >
          <View style={styles.headerContent}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.push('/')}
              accessibilityLabel="買い物リスト一覧に戻る"
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={colors.accent.primary}
              />
            </Pressable>
            {editMode ? (
              <View style={styles.editNameContainer}>
                <TextInput
                  style={[
                    styles.nameInput,
                    {
                      borderColor: colors.border.primary,
                      backgroundColor: colors.background.primary,
                      color: colors.text.primary,
                    },
                  ]}
                  value={listName}
                  onChangeText={setListName}
                  placeholder="リスト名を入力"
                  placeholderTextColor={colors.text.tertiary}
                  autoFocus
                />
                <Pressable
                  style={[
                    styles.saveButton,
                    { backgroundColor: colors.accent.primary },
                  ]}
                  onPress={handleSaveListName}
                >
                  <Text
                    style={[
                      styles.saveButtonText,
                      { color: colors.text.inverse },
                    ]}
                  >
                    保存
                  </Text>
                </Pressable>
              </View>
            ) : (
              <>
                <Pressable
                  style={styles.titleContainer}
                  onPress={() => {
                    setListName(list.name);
                    setEditMode(true);
                  }}
                >
                  <Text style={[styles.title, { color: colors.text.primary }]}>
                    {list.name}
                  </Text>
                  <Ionicons
                    name="pencil"
                    size={20}
                    color={colors.text.secondary}
                  />
                </Pressable>
                <View style={styles.headerActions}>
                  <Pressable
                    style={[
                      styles.completeButton,
                      { backgroundColor: '#34C759' }
                    ]}
                    onPress={handleCompleteList}
                  >
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                    <Text style={[styles.completeButtonText, { color: '#fff' }]}>
                      完了
                    </Text>
                  </Pressable>
                  
                  <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                      <IconButton
                        icon="sort"
                        size={24}
                        onPress={() => setMenuVisible(true)}
                        iconColor={colors.text.primary}
                      />
                    }
                    contentStyle={{
                      backgroundColor: colors.background.primary,
                    }}
                  >
                    <Menu.Item
                      title="作成順（昇順）"
                      onPress={() => handleSortChange('created', 'asc')}
                      titleStyle={{ color: colors.text.primary }}
                    />
                    <Menu.Item
                      title="作成順（降順）"
                      onPress={() => handleSortChange('created', 'desc')}
                      titleStyle={{ color: colors.text.primary }}
                    />
                    <Menu.Item
                      title="名前順（昇順）"
                      onPress={() => handleSortChange('name', 'asc')}
                      titleStyle={{ color: colors.text.primary }}
                    />
                    <Menu.Item
                      title="名前順（降順）"
                      onPress={() => handleSortChange('name', 'desc')}
                      titleStyle={{ color: colors.text.primary }}
                    />
                    <Menu.Item
                      title="カテゴリ順（昇順）"
                      onPress={() => handleSortChange('category', 'asc')}
                      titleStyle={{ color: colors.text.primary }}
                    />
                    <Menu.Item
                      title="カテゴリ順（降順）"
                      onPress={() => handleSortChange('category', 'desc')}
                      titleStyle={{ color: colors.text.primary }}
                    />
                  </Menu>
                  
                  <Pressable
                    style={styles.deleteListButton}
                    onPress={() => setShowDeleteConfirm(true)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>

        <View
          style={[
            styles.quickAdd,
            {
              borderBottomColor: colors.border.secondary,
              backgroundColor: colors.background.primary,
            },
          ]}
        >
          <TextInput
            style={[
              styles.quickAddInput,
              {
                borderColor: colors.border.primary,
                backgroundColor: colors.background.primary,
                color: colors.text.primary,
              },
            ]}
            placeholder="商品名を入力して追加"
            placeholderTextColor={colors.text.tertiary}
            ref={quickAddInputRef}
            onSubmitEditing={(event) => handleQuickAdd(event.nativeEvent.text)}
            returnKeyType="done"
          />
        </View>

        <ScrollView
          style={styles.listContent}
          contentContainerStyle={{ paddingBottom: 96 }}
        >
          <GroupedPicklistItems
            listId={id}
            onItemPress={(item) => handleToggleComplete(item.id)}
            onItemDelete={handleRemoveItem}
            onNotePress={(item) => setNoteModalItem(item)}
          />
        </ScrollView>

        {editingItem && (
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.background.primary },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                アイテムを編集
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                  数量
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border.primary,
                      backgroundColor: colors.background.primary,
                      color: colors.text.primary,
                    },
                  ]}
                  value={editingItem.quantity}
                  onChangeText={(text) =>
                    setEditingItem({ ...editingItem, quantity: text })
                  }
                  keyboardType="numeric"
                  placeholder="数量を入力"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                  価格上限
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border.primary,
                      backgroundColor: colors.background.primary,
                      color: colors.text.primary,
                    },
                  ]}
                  value={editingItem.maxPrice}
                  onChangeText={(text) =>
                    setEditingItem({ ...editingItem, maxPrice: text })
                  }
                  keyboardType="numeric"
                  placeholder="任意"
                  placeholderTextColor={colors.text.tertiary}
                />
                <Text style={[styles.unit, { color: colors.text.secondary }]}>
                  円
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                  メモ
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.noteInput,
                    {
                      borderColor: colors.border.primary,
                      backgroundColor: colors.background.primary,
                      color: colors.text.primary,
                    },
                  ]}
                  value={editingItem.note}
                  onChangeText={(text) =>
                    setEditingItem({ ...editingItem, note: text })
                  }
                  placeholder="任意"
                  placeholderTextColor={colors.text.tertiary}
                  multiline
                />
              </View>

              <View style={styles.modalButtons}>
                <Pressable
                  style={[
                    styles.modalButton,
                    styles.modalCancelButton,
                    {
                      backgroundColor: isDark ? '#333' : '#f0f0f0',
                    },
                  ]}
                  onPress={() => setEditingItem(null)}
                >
                  <Text
                    style={[
                      styles.modalCancelButtonText,
                      { color: colors.text.primary },
                    ]}
                  >
                    キャンセル
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.modalButton,
                    styles.modalSaveButton,
                    {
                      backgroundColor: colors.accent.primary,
                    },
                  ]}
                  onPress={handleSaveItem}
                >
                  <Text
                    style={[
                      styles.modalSaveButtonText,
                      { color: colors.text.inverse },
                    ]}
                  >
                    保存
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {showDeleteConfirm && (
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.background.primary },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                買い物リストを削除
              </Text>
              <Text
                style={[styles.modalMessage, { color: colors.text.secondary }]}
              >
                「{list.name}」を削除してもよろしいですか？
                {'\n'}この操作は取り消せません。
              </Text>
              <View style={styles.modalButtons}>
                <Pressable
                  style={[
                    styles.modalButton,
                    styles.modalCancelButton,
                    {
                      backgroundColor: isDark ? '#333' : '#f0f0f0',
                    },
                  ]}
                  onPress={() => setShowDeleteConfirm(false)}
                >
                  <Text
                    style={[
                      styles.modalCancelButtonText,
                      { color: colors.text.primary },
                    ]}
                  >
                    キャンセル
                  </Text>
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

        {noteModalItem && (
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.background.primary },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                メモ
              </Text>
              <ScrollView style={{ maxHeight: 200, marginBottom: 24 }}>
                <Text style={{ color: colors.text.primary }}>
                  {noteModalItem.note || 'メモがありません'}
                </Text>
              </ScrollView>
              <Pressable
                style={[
                  styles.modalButton,
                  styles.modalCancelButton,
                  { backgroundColor: isDark ? '#333' : '#f0f0f0' },
                ]}
                onPress={() => setNoteModalItem(null)}
              >
                <Text
                  style={[
                    styles.modalCancelButtonText,
                    { color: colors.text.primary },
                  ]}
                >
                  閉じる
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.bottomButtons}>
          <Pressable
            style={[
              styles.addFromFrequentButton,
              {
                backgroundColor: colors.accent.primary,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
            onPress={() => router.push(`/frequent-products?selectForList=${id}`)}
          >
            <Ionicons 
              name="add-circle-outline" 
              size={20} 
              color="#fff" 
            />
            <Text 
              style={{ 
                color: '#fff', 
                marginLeft: 6, 
                fontWeight: '600', 
                fontSize: 14 
              }}
            >
              よく買う商品から追加
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.completeBottomButton,
              { 
                backgroundColor: list.items.some(item => item.completed) 
                  ? '#34C759' 
                  : colors.control.inactive
              }
            ]}
            onPress={list.items.length > 0 ? handleCompleteList : undefined}
            disabled={list.items.length === 0}
          >
            <Ionicons 
              name="checkmark-circle-outline" 
              size={20} 
              color="#fff" 
            />
            <Text style={[styles.completeBottomButtonText, { color: '#fff' }]}>
              完了
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 8,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  editNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
  },
  nameInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
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
  },
  itemNote: {
    fontSize: 14,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  deleteListButton: {
    padding: 8,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    gap: 4,
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
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
  modalCancelButton: {},
  modalDeleteButton: {
    backgroundColor: '#FF3B30',
  },
  modalCancelButtonText: {
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
  modalSaveButton: {},
  modalSaveButtonText: {
    fontWeight: '600',
  },
  bottomButtons: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 8,
    flexDirection: 'row',
    gap: 12,
  },
  completeBottomButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    gap: 6,
  },
  completeBottomButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addFromFrequentButton: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  addFromFrequentButtonFull: {
    height: 48,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAdd: {
    padding: 12,
    borderBottomWidth: 1,
  },
  quickAddInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  listContent: {
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
});
