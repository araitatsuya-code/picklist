import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 買い物リストの各アイテムを表すインターフェース
 */
export interface PicklistItem {
  id: string; // アイテムの一意識別子
  name: string; // アイテム名
  quantity: number; // 数量
  unit: string; // 単位（個、本、など）
  isChecked: boolean; // チェック状態
  order: number; // 表示順序
  barcode?: string; // バーコード（オプション）
}

/**
 * 買い物リスト全体を表すインターフェース
 */
export interface Picklist {
  id: string; // リストの一意識別子
  name: string; // リスト名
  items: PicklistItem[]; // リストアイテムの配列
  createdAt: Date; // 作成日時
  updatedAt: Date; // 更新日時
}

/**
 * 買い物リストの状態管理とアクションを定義するインターフェース
 */
interface PicklistStore {
  picklists: Picklist[]; // 全ての買い物リスト
  addPicklist: (name: string) => void; // 新規リスト追加
  removePicklist: (id: string) => void; // リスト削除
  addItem: (
    picklistId: string,
    item: Omit<PicklistItem, 'id' | 'order'>
  ) => void; // アイテム追加
  removeItem: (picklistId: string, itemId: string) => void; // アイテム削除
  toggleItem: (picklistId: string, itemId: string) => void; // アイテムのチェック状態切り替え
  reorderItems: (
    picklistId: string,
    startIndex: number,
    endIndex: number
  ) => void; // アイテムの並び替え
}

/**
 * Zustandストアの作成
 * AsyncStorageを使用して永続化を実現
 */
export const usePicklistStore = create<PicklistStore>()(
  persist(
    (set) => ({
      picklists: [],

      // 新しい買い物リストを追加
      addPicklist: (name) =>
        set((state) => ({
          picklists: [
            ...state.picklists,
            {
              id: Date.now().toString(),
              name,
              items: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),

      // 指定されたIDの買い物リストを削除
      removePicklist: (id) =>
        set((state) => ({
          picklists: state.picklists.filter((list) => list.id !== id),
        })),

      // 指定されたリストに新しいアイテムを追加
      addItem: (picklistId, item) =>
        set((state) => ({
          picklists: state.picklists.map((list) => {
            if (list.id !== picklistId) return list;
            return {
              ...list,
              items: [
                ...list.items,
                {
                  ...item,
                  id: Date.now().toString(),
                  order: list.items.length,
                },
              ],
              updatedAt: new Date(),
            };
          }),
        })),

      // 指定されたリストから特定のアイテムを削除
      removeItem: (picklistId, itemId) =>
        set((state) => ({
          picklists: state.picklists.map((list) => {
            if (list.id !== picklistId) return list;
            return {
              ...list,
              items: list.items.filter((item) => item.id !== itemId),
              updatedAt: new Date(),
            };
          }),
        })),

      // アイテムのチェック状態を切り替え
      toggleItem: (picklistId, itemId) =>
        set((state) => ({
          picklists: state.picklists.map((list) => {
            if (list.id !== picklistId) return list;
            return {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId
                  ? { ...item, isChecked: !item.isChecked }
                  : item
              ),
              updatedAt: new Date(),
            };
          }),
        })),

      // ドラッグ&ドロップによるアイテムの並び替え
      reorderItems: (picklistId, startIndex, endIndex) =>
        set((state) => ({
          picklists: state.picklists.map((list) => {
            if (list.id !== picklistId) return list;
            const newItems = [...list.items];
            const [removed] = newItems.splice(startIndex, 1);
            newItems.splice(endIndex, 0, removed);
            return {
              ...list,
              items: newItems.map((item, index) => ({ ...item, order: index })),
              updatedAt: new Date(),
            };
          }),
        })),
    }),
    {
      name: 'picklist-storage', // ストレージのキー名
      storage: createJSONStorage(() => AsyncStorage), // AsyncStorageを使用した永続化
    }
  )
);
