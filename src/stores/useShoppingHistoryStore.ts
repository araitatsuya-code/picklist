import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PicklistItem, Picklist } from './usePicklistStore';

/**
 * 買い物履歴エントリを表すインターフェース
 */
export interface ShoppingHistoryEntry {
  id: string; // 履歴エントリの一意識別子
  listId: string; // 元のリストID
  listName: string; // リスト名
  completedAt: number; // 完了日時（タイムスタンプ）
  completedDate: string; // 完了日（YYYY-MM-DD形式）
  items: HistoryItem[]; // 完了時点でのアイテム一覧
  totalItems: number; // 総アイテム数
  completedItems: number; // 完了したアイテム数
  completionRate: number; // 完了率（0-100）
  categoryBreakdown: CategorySummary[]; // カテゴリー別サマリー
}

/**
 * 履歴用アイテム（完了時点のスナップショット）
 */
export interface HistoryItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unit?: string;
  maxPrice?: number;
  note?: string;
  completed: boolean;
  category?: string;
  priority: number;
}

/**
 * カテゴリー別サマリー
 */
export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  totalItems: number;
  completedItems: number;
  completionRate: number;
}

/**
 * 日付別履歴サマリー
 */
export interface DateSummary {
  date: string; // YYYY-MM-DD
  entryCount: number; // その日の履歴エントリ数
  totalLists: number; // その日に完了したリスト数
  averageCompletionRate: number; // その日の平均完了率
}

type ShoppingHistoryState = {
  histories: ShoppingHistoryEntry[];
  isLoading: boolean;
};

type ShoppingHistoryActions = {
  // 履歴管理
  addHistory: (list: Picklist) => void;
  removeHistory: (id: string) => void;
  clearAllHistories: () => void;
  
  // 検索・取得
  getHistoryByDate: (date: string) => ShoppingHistoryEntry[];
  getHistoryByDateRange: (startDate: string, endDate: string) => ShoppingHistoryEntry[];
  getHistoryById: (id: string) => ShoppingHistoryEntry | undefined;
  
  // 統計
  getDateSummaries: () => DateSummary[];
  getMonthSummary: (year: number, month: number) => DateSummary[];
  getTotalStats: () => {
    totalHistories: number;
    totalCompletedLists: number;
    averageCompletionRate: number;
    mostActiveDate: string | null;
  };
  
  // ユーティリティ
  hasHistoryForDate: (date: string) => boolean;
  getRecentHistories: (limit?: number) => ShoppingHistoryEntry[];
};

// 日付フォーマット関数
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

// カテゴリー別サマリー計算
const calculateCategoryBreakdown = (items: HistoryItem[]): CategorySummary[] => {
  const categoryMap = new Map<string, { total: number; completed: number; name: string }>();
  
  items.forEach(item => {
    const categoryId = item.category || 'uncategorized';
    const categoryName = item.category || 'その他';
    
    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, { total: 0, completed: 0, name: categoryName });
    }
    
    const summary = categoryMap.get(categoryId)!;
    summary.total++;
    if (item.completed) {
      summary.completed++;
    }
  });
  
  return Array.from(categoryMap.entries()).map(([categoryId, data]) => ({
    categoryId,
    categoryName: data.name,
    totalItems: data.total,
    completedItems: data.completed,
    completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
  }));
};

export const useShoppingHistoryStore = create<ShoppingHistoryState & ShoppingHistoryActions>()(
  persist(
    (set, get) => ({
      // State
      histories: [],
      isLoading: false,
      
      // Actions
      addHistory: (list: Picklist) => {
        const completedAt = Date.now();
        const completedDate = formatDate(completedAt);
        const totalItems = list.items.length;
        const completedItems = list.items.filter(item => item.completed).length;
        const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        
        // HistoryItemに変換
        const historyItems: HistoryItem[] = list.items.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          maxPrice: item.maxPrice,
          note: item.note,
          completed: item.completed,
          category: item.category,
          priority: item.priority,
        }));
        
        const newEntry: ShoppingHistoryEntry = {
          id: `history_${completedAt}_${list.id}`,
          listId: list.id,
          listName: list.name,
          completedAt,
          completedDate,
          items: historyItems,
          totalItems,
          completedItems,
          completionRate,
          categoryBreakdown: calculateCategoryBreakdown(historyItems),
        };
        
        set(state => ({
          ...state,
          histories: [newEntry, ...state.histories], // 新しい履歴を先頭に追加
        }));
      },
      
      removeHistory: (id: string) => {
        set(state => ({
          histories: state.histories.filter(history => history.id !== id),
        }));
      },
      
      clearAllHistories: () => {
        set({ histories: [] });
      },
      
      getHistoryByDate: (date: string) => {
        const { histories } = get();
        return histories.filter(history => history.completedDate === date);
      },
      
      getHistoryByDateRange: (startDate: string, endDate: string) => {
        const { histories } = get();
        return histories.filter(history => 
          history.completedDate >= startDate && history.completedDate <= endDate
        );
      },
      
      getHistoryById: (id: string) => {
        const { histories } = get();
        return histories.find(history => history.id === id);
      },
      
      getDateSummaries: () => {
        const { histories } = get();
        const dateMap = new Map<string, { count: number; totalRate: number; lists: number }>();
        
        histories.forEach(history => {
          const date = history.completedDate;
          if (!dateMap.has(date)) {
            dateMap.set(date, { count: 0, totalRate: 0, lists: 0 });
          }
          
          const summary = dateMap.get(date)!;
          summary.count++;
          summary.lists++;
          summary.totalRate += history.completionRate;
        });
        
        return Array.from(dateMap.entries())
          .map(([date, data]) => ({
            date,
            entryCount: data.count,
            totalLists: data.lists,
            averageCompletionRate: data.count > 0 ? Math.round(data.totalRate / data.count) : 0,
          }))
          .sort((a, b) => b.date.localeCompare(a.date)); // 最新日付順
      },
      
      getMonthSummary: (year: number, month: number) => {
        const { getDateSummaries } = get();
        const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
        
        return getDateSummaries().filter(summary => 
          summary.date.startsWith(monthStr)
        );
      },
      
      getTotalStats: () => {
        const { histories } = get();
        
        if (histories.length === 0) {
          return {
            totalHistories: 0,
            totalCompletedLists: 0,
            averageCompletionRate: 0,
            mostActiveDate: null,
          };
        }
        
        const totalHistories = histories.length;
        const totalCompletedLists = histories.length;
        const averageCompletionRate = Math.round(
          histories.reduce((sum, h) => sum + h.completionRate, 0) / histories.length
        );
        
        // 最もアクティブな日付を計算
        const dateCount = new Map<string, number>();
        histories.forEach(history => {
          const date = history.completedDate;
          dateCount.set(date, (dateCount.get(date) || 0) + 1);
        });
        
        const mostActiveDate = Array.from(dateCount.entries())
          .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
        
        return {
          totalHistories,
          totalCompletedLists,
          averageCompletionRate,
          mostActiveDate,
        };
      },
      
      hasHistoryForDate: (date: string) => {
        const { histories } = get();
        return histories.some(history => history.completedDate === date);
      },
      
      getRecentHistories: (limit = 10) => {
        const { histories } = get();
        return histories.slice(0, limit);
      },
    }),
    {
      name: 'shopping-history-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        histories: state.histories,
      }),
    }
  )
);