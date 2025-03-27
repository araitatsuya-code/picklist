import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 買い物リストの各アイテムを表すインターフェース
 */
export interface PicklistItem {
  id: string; // アイテムの一意識別子
  productId: string;
  name: string; // アイテム名
  quantity: number; // 数量
  unit?: string; // 追加
  maxPrice?: number;
  note?: string;
  completed: boolean;
  category?: string; // カテゴリID
  priority: number; // 優先順位（1: 高, 2: 中, 3: 低）
}

/**
 * 買い物リスト全体を表すインターフェース
 */
export interface Picklist {
  id: string; // リストの一意識別子
  name: string; // リスト名
  items: PicklistItem[]; // リストアイテムの配列
  createdAt: number; // 作成日時
  updatedAt: number; // 更新日時
  sortBy?: 'name' | 'category' | 'priority' | 'created';
  sortDirection?: 'asc' | 'desc';
  groupByCategory?: boolean; // カテゴリでグループ化するかどうか
}

type PicklistState = {
  picklists: Picklist[];
};

type PicklistActions = {
  addPicklist: (name: string) => void;
  removePicklist: (id: string) => void;
  updatePicklist: (id: string, updates: Partial<Picklist>) => void;
  addItemsToList: (listId: string, items: Omit<PicklistItem, 'id'>[]) => void;
  updateItem: (
    listId: string,
    itemId: string,
    updates: Partial<PicklistItem>
  ) => void;
  removeItem: (listId: string, itemId: string) => void;
  toggleItemCompletion: (listId: string, itemId: string) => void;
  updateItemCategory: (
    listId: string,
    itemId: string,
    categoryId: string
  ) => void;
  updateItemPriority: (
    listId: string,
    itemId: string,
    priority: number
  ) => void;
  updateListSortSettings: (
    listId: string,
    sortBy?: 'name' | 'category' | 'priority' | 'created',
    sortDirection?: 'asc' | 'desc',
    groupByCategory?: boolean
  ) => void;
};

// 型をエクスポート
export type PicklistStore = PicklistState & PicklistActions;

/**
 * Zustandストアの作成
 * AsyncStorageを使用して永続化を実現
 */
export const usePicklistStore = create<PicklistState & PicklistActions>()(
  persist(
    (set) => ({
      picklists: [],

      // 新しい買い物リストを追加
      addPicklist: (name) => {
        const now = Date.now();
        const newList: Picklist = {
          id: now.toString(),
          name,
          items: [],
          createdAt: now,
          updatedAt: now,
          sortBy: 'category',
          groupByCategory: true,
        };

        set((state) => ({
          picklists: [...state.picklists, newList],
        }));
      },

      // 指定されたIDの買い物リストを削除
      removePicklist: (id) => {
        set((state) => ({
          picklists: state.picklists.filter((list) => list.id !== id),
        }));
      },

      updatePicklist: (id, updates) => {
        set((state) => ({
          picklists: state.picklists.map((list) =>
            list.id === id
              ? { ...list, ...updates, updatedAt: Date.now() }
              : list
          ),
        }));
      },

      addItemsToList: (listId, items) => {
        set((state) => ({
          picklists: state.picklists.map((list) => {
            if (list.id !== listId) return list;

            const now = Date.now();
            const newItems: PicklistItem[] = items.map((item) => ({
              ...item,
              id: `${now}_${item.productId}`,
              priority: item.priority || 2, // デフォルトは中優先度
            }));

            return {
              ...list,
              items: [...list.items, ...newItems],
              updatedAt: now,
            };
          }),
        }));
      },

      updateItem: (listId, itemId, updates) => {
        set((state) => ({
          picklists: state.picklists.map((list) => {
            if (list.id !== listId) return list;

            return {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      // 指定されたリストから特定のアイテムを削除
      removeItem: (listId, itemId) => {
        set((state) => ({
          picklists: state.picklists.map((list) => {
            if (list.id !== listId) return list;

            return {
              ...list,
              items: list.items.filter((item) => item.id !== itemId),
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      // アイテムのチェック状態を切り替え
      toggleItemCompletion: (listId, itemId) => {
        set((state) => ({
          picklists: state.picklists.map((list) => {
            if (list.id !== listId) return list;

            return {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId
                  ? { ...item, completed: !item.completed }
                  : item
              ),
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      updateItemCategory: (listId, itemId, categoryId) => {
        set((state) => ({
          picklists: state.picklists.map((list) => {
            if (list.id !== listId) return list;

            return {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, category: categoryId } : item
              ),
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      updateItemPriority: (listId, itemId, priority) => {
        set((state) => ({
          picklists: state.picklists.map((list) => {
            if (list.id !== listId) return list;

            return {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, priority } : item
              ),
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      updateListSortSettings: (
        listId,
        sortBy,
        sortDirection,
        groupByCategory
      ) => {
        set((state) => ({
          picklists: state.picklists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  sortBy,
                  sortDirection,
                  groupByCategory,
                  updatedAt: Date.now(),
                }
              : list
          ),
        }));
      },
    }),
    {
      name: 'picklist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
