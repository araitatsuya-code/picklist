import { create } from 'zustand';
import { PicklistStore } from './usePicklistStore';

// テスト用の簡易ストア
const createTestStore = () =>
  create<PicklistStore>((set) => ({
    picklists: [],
    addPicklist: (name) =>
      set((state) => ({
        picklists: [
          ...state.picklists,
          {
            id: 'test-id',
            name,
            items: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      })),
    removePicklist: (id) =>
      set((state) => ({
        picklists: state.picklists.filter((list) => list.id !== id),
      })),
    // ... 他のアクションは必要に応じて追加
  }));

describe('usePicklistStore', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it('should add a new picklist', () => {
    store.getState().addPicklist('テストリスト');
    expect(store.getState().picklists).toHaveLength(1);
    expect(store.getState().picklists[0].name).toBe('テストリスト');
  });

  it('should remove a picklist', () => {
    store.getState().addPicklist('テストリスト');
    const listId = store.getState().picklists[0].id;
    store.getState().removePicklist(listId);
    expect(store.getState().picklists).toHaveLength(0);
  });
});
