import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Category {
  id: string;
  name: string;
  displayOrder: number;
  priority: number;
  color?: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'vegetables', name: '野菜', displayOrder: 1, priority: 1 },
  { id: 'meat-fish', name: '魚・肉', displayOrder: 2, priority: 2 },
  { id: 'dairy', name: '日配品', displayOrder: 3, priority: 3 },
  { id: 'deli', name: '惣菜', displayOrder: 4, priority: 4 },
  { id: 'grocery', name: '食品', displayOrder: 5, priority: 5 },
  { id: 'daily', name: '日用品', displayOrder: 6, priority: 6 },
  { id: 'other', name: 'その他', displayOrder: 7, priority: 7 },
];

type CategoryState = {
  categories: Category[];
};

type CategoryActions = {
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  reorderCategories: (categories: Category[]) => void;
  resetToDefault: () => void;
};

export type CategoryStore = CategoryState & CategoryActions;

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set) => ({
      categories: DEFAULT_CATEGORIES,

      addCategory: (category) => {
        const now = Date.now();
        const newCategory: Category = {
          ...category,
          id: now.toString(),
        };

        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...updates } : category
          ),
        }));
      },

      removeCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },

      reorderCategories: (categories) => {
        set({ categories });
      },

      resetToDefault: () => {
        set({ categories: DEFAULT_CATEGORIES });
      },
    }),
    {
      name: 'category-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
