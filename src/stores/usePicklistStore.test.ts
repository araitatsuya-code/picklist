import { create } from 'zustand';
import type { PicklistStore, Picklist } from './usePicklistStore';

// テスト用の簡易ストア
const createTestStore = () =>
  create<PicklistStore>()((set) => ({
    picklists: [],
    addPicklist: (name: string) => {
      const now = Date.now();
      set((state) => ({
        picklists: [
          ...state.picklists,
          {
            id: now.toString(),
            name,
            items: [],
            createdAt: now,
            updatedAt: now,
          },
        ],
      }));
    },
    removePicklist: (id: string) => {
      set((state) => ({
        picklists: state.picklists.filter((list) => list.id !== id),
      }));
    },
    updatePicklist: (id: string, updates: Partial<Picklist>) => {
      set((state) => ({
        picklists: state.picklists.map((list) =>
          list.id === id ? { ...list, ...updates, updatedAt: Date.now() } : list
        ),
      }));
    },
    addItemsToList: (listId: string, items) => {
      const now = Date.now();
      set((state) => ({
        picklists: state.picklists.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: [
                  ...list.items,
                  ...items.map((item) => ({
                    ...item,
                    id: `${now}_${item.productId}`,
                  })),
                ],
                updatedAt: now,
              }
            : list
        ),
      }));
    },
    updateItem: (listId, itemId, updates) => {
      set((state) => ({
        picklists: state.picklists.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: list.items.map((item) =>
                  item.id === itemId ? { ...item, ...updates } : item
                ),
                updatedAt: Date.now(),
              }
            : list
        ),
      }));
    },
    removeItem: (listId, itemId) => {
      set((state) => ({
        picklists: state.picklists.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: list.items.filter((item) => item.id !== itemId),
                updatedAt: Date.now(),
              }
            : list
        ),
      }));
    },
    toggleItemCompletion: (listId, itemId) => {
      set((state) => ({
        picklists: state.picklists.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: list.items.map((item) =>
                  item.id === itemId
                    ? { ...item, completed: !item.completed }
                    : item
                ),
                updatedAt: Date.now(),
              }
            : list
        ),
      }));
    },
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
