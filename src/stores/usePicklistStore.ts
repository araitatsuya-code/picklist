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
  maxPrice?: number;
  note?: string;
  completed: boolean;
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
}

/**
 * 買い物リストの状態管理とアクションを定義するインターフェース
 */
export interface PicklistStore {
  picklists: Picklist[]; // 全ての買い物リスト
  addPicklist: (name: string) => void; // 新規リスト追加
  removePicklist: (id: string) => void; // リスト削除
  updatePicklist: (id: string, updates: Partial<Picklist>) => void;
  addItemsToList: (listId: string, items: Omit<PicklistItem, 'id'>[]) => void;
  updateItem: (
    listId: string,
    itemId: string,
    updates: Partial<PicklistItem>
  ) => void;
  removeItem: (listId: string, itemId: string) => void;
  toggleItemCompletion: (listId: string, itemId: string) => void;
}

/**
 * Zustandストアの作成
 * AsyncStorageを使用して永続化を実現
 */
export const usePicklistStore = create<PicklistStore>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: 'picklist-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        console.log(
          'State hydrated:',
          state?.picklists.length ?? 0,
          'picklists'
        );
      },
    }
  )
);
