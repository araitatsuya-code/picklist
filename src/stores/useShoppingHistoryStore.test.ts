import { useShoppingHistoryStore } from './useShoppingHistoryStore';
import { Picklist, PicklistItem } from './usePicklistStore';

// AsyncStorageのモック
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// モックデータの作成
const createMockPicklist = (
  id: string = 'test-list-1',
  name: string = 'テストリスト',
  items: Partial<PicklistItem>[] = []
): Picklist => {
  const mockItems: PicklistItem[] = items.map((item, index) => ({
    id: item.id || `item-${index}`,
    productId: item.productId || `product-${index}`,
    name: item.name || `商品${index + 1}`,
    quantity: item.quantity || 1,
    unit: item.unit,
    maxPrice: item.maxPrice,
    note: item.note,
    completed: item.completed || false,
    category: item.category || 'test-category',
    priority: item.priority || 1,
  }));

  return {
    id,
    name,
    items: mockItems,
    createdAt: Date.now() - 3600000, // 1時間前
    updatedAt: Date.now(),
    sortBy: 'created',
    sortDirection: 'asc',
    groupByCategory: false,
  };
};

describe('useShoppingHistoryStore', () => {
  beforeEach(() => {
    // 各テストの前にストアをリセット
    useShoppingHistoryStore.setState({ histories: [], isLoading: false });
  });

  describe('履歴の追加', () => {
    it('リストを履歴に追加できる', () => {
      const mockList = createMockPicklist('list-1', 'テストリスト', [
        { name: '商品1', completed: true },
        { name: '商品2', completed: false },
        { name: '商品3', completed: true },
      ]);

      const store = useShoppingHistoryStore.getState();
      store.addHistory(mockList);

      // ストアの状態を再取得
      const updatedStore = useShoppingHistoryStore.getState();
      const histories = updatedStore.histories;
      expect(histories).toHaveLength(1);

      const history = histories[0];
      expect(history.listId).toBe('list-1');
      expect(history.listName).toBe('テストリスト');
      expect(history.totalItems).toBe(3);
      expect(history.completedItems).toBe(2);
      expect(history.completionRate).toBe(67); // 2/3 = 66.67% -> 67%
      expect(history.items).toHaveLength(3);
    });

    it('完了率が正しく計算される', () => {
      const mockList = createMockPicklist('list-2', 'All完了リスト', [
        { name: '商品1', completed: true },
        { name: '商品2', completed: true },
        { name: '商品3', completed: true },
      ]);

      const store = useShoppingHistoryStore.getState();
      store.addHistory(mockList);

      // ストアの状態を再取得
      const updatedStore = useShoppingHistoryStore.getState();
      const history = updatedStore.histories[0];
      expect(history.completionRate).toBe(100);
    });

    it('空のリストの履歴を追加できる', () => {
      const mockList = createMockPicklist('empty-list', '空のリスト', []);

      const store = useShoppingHistoryStore.getState();
      store.addHistory(mockList);

      // ストアの状態を再取得
      const updatedStore = useShoppingHistoryStore.getState();
      const history = updatedStore.histories[0];
      expect(history.totalItems).toBe(0);
      expect(history.completedItems).toBe(0);
      expect(history.completionRate).toBe(0);
    });
  });

  describe('日付による検索', () => {
    beforeEach(() => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // 今日の履歴を追加
      jest.spyOn(Date, 'now').mockReturnValue(today.getTime());
      const todayList = createMockPicklist('today-list', '今日のリスト');
      useShoppingHistoryStore.getState().addHistory(todayList);

      // 昨日の履歴を追加
      jest.spyOn(Date, 'now').mockReturnValue(yesterday.getTime());
      const yesterdayList = createMockPicklist('yesterday-list', '昨日のリスト');
      useShoppingHistoryStore.getState().addHistory(yesterdayList);

      jest.restoreAllMocks();
    });

    it('特定の日付の履歴を取得できる', () => {
      const store = useShoppingHistoryStore.getState();
      const today = new Date().toISOString().split('T')[0];
      
      const todayHistories = store.getHistoryByDate(today);
      expect(todayHistories).toHaveLength(1);
      expect(todayHistories[0].listName).toBe('今日のリスト');
    });

    it('履歴がない日付では空配列を返す', () => {
      const store = useShoppingHistoryStore.getState();
      const futureDate = '2025-12-31';
      
      const histories = store.getHistoryByDate(futureDate);
      expect(histories).toHaveLength(0);
    });

    it('日付範囲で履歴を取得できる', () => {
      const store = useShoppingHistoryStore.getState();
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];
      
      const histories = store.getHistoryByDateRange(weekAgoStr, today);
      expect(histories.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('統計機能', () => {
    beforeEach(() => {
      // テスト用の履歴データを複数追加
      const lists = [
        createMockPicklist('list-1', 'リスト1', [
          { completed: true },
          { completed: true },
          { completed: false },
        ]),
        createMockPicklist('list-2', 'リスト2', [
          { completed: true },
          { completed: true },
        ]),
      ];

      const store = useShoppingHistoryStore.getState();
      lists.forEach(list => store.addHistory(list));
    });

    it('日付サマリーを取得できる', () => {
      const store = useShoppingHistoryStore.getState();
      const summaries = store.getDateSummaries();
      
      expect(summaries.length).toBeGreaterThan(0);
      summaries.forEach(summary => {
        expect(summary.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(summary.entryCount).toBeGreaterThan(0);
        expect(summary.totalLists).toBeGreaterThan(0);
        expect(summary.averageCompletionRate).toBeGreaterThanOrEqual(0);
        expect(summary.averageCompletionRate).toBeLessThanOrEqual(100);
      });
    });

    it('全体統計を取得できる', () => {
      const store = useShoppingHistoryStore.getState();
      const stats = store.getTotalStats();
      
      expect(stats.totalHistories).toBe(2);
      expect(stats.totalCompletedLists).toBe(2);
      expect(stats.averageCompletionRate).toBeGreaterThan(0);
      expect(stats.mostActiveDate).toBeTruthy();
    });

    it('特定の日付に履歴があるか確認できる', () => {
      const store = useShoppingHistoryStore.getState();
      const today = new Date().toISOString().split('T')[0];
      
      expect(store.hasHistoryForDate(today)).toBe(true);
      expect(store.hasHistoryForDate('2020-01-01')).toBe(false);
    });
  });

  describe('履歴の削除', () => {
    it('特定の履歴を削除できる', () => {
      const mockList = createMockPicklist();
      const store = useShoppingHistoryStore.getState();
      
      store.addHistory(mockList);
      
      // ストアの状態を再取得
      let updatedStore = useShoppingHistoryStore.getState();
      expect(updatedStore.histories).toHaveLength(1);
      
      const historyId = updatedStore.histories[0].id;
      store.removeHistory(historyId);
      
      // 削除後の状態を再取得
      updatedStore = useShoppingHistoryStore.getState();
      expect(updatedStore.histories).toHaveLength(0);
    });

    it('全履歴をクリアできる', () => {
      const lists = [
        createMockPicklist('list-1'),
        createMockPicklist('list-2'),
        createMockPicklist('list-3'),
      ];
      
      const store = useShoppingHistoryStore.getState();
      lists.forEach(list => store.addHistory(list));
      
      // ストアの状態を再取得
      let updatedStore = useShoppingHistoryStore.getState();
      expect(updatedStore.histories).toHaveLength(3);
      
      store.clearAllHistories();
      
      // クリア後の状態を再取得
      updatedStore = useShoppingHistoryStore.getState();
      expect(updatedStore.histories).toHaveLength(0);
    });
  });

  describe('カテゴリー別サマリー', () => {
    it('カテゴリー別の統計が正しく計算される', () => {
      const mockList = createMockPicklist('categorized-list', 'カテゴリーテスト', [
        { name: '野菜1', category: 'vegetables', completed: true },
        { name: '野菜2', category: 'vegetables', completed: false },
        { name: '肉1', category: 'meat', completed: true },
        { name: 'その他1', category: undefined, completed: true },
      ]);

      const store = useShoppingHistoryStore.getState();
      store.addHistory(mockList);

      // ストアの状態を再取得
      const updatedStore = useShoppingHistoryStore.getState();
      const history = updatedStore.histories[0];
      const breakdown = history.categoryBreakdown;
      
      expect(breakdown).toHaveLength(3); // vegetables, meat, uncategorized
      
      const vegetablesCategory = breakdown.find(c => c.categoryId === 'vegetables');
      expect(vegetablesCategory).toBeTruthy();
      expect(vegetablesCategory!.totalItems).toBe(2);
      expect(vegetablesCategory!.completedItems).toBe(1);
      expect(vegetablesCategory!.completionRate).toBe(50);
      
      const meatCategory = breakdown.find(c => c.categoryId === 'meat');
      expect(meatCategory).toBeTruthy();
      expect(meatCategory!.totalItems).toBe(1);
      expect(meatCategory!.completedItems).toBe(1);
      expect(meatCategory!.completionRate).toBe(100);
    });
  });
});