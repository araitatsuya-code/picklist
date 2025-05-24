import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { initialProducts } from '../data/initialFrequentProducts';

interface FrequentProductState {
  products: FrequentProduct[];
  addProduct: (
    product: Omit<
      FrequentProduct,
      'id' | 'createdAt' | 'updatedAt' | 'addCount'
    >
  ) => void;
  updateProduct: (
    id: string,
    product: Partial<Omit<FrequentProduct, 'id' | 'createdAt'>>
  ) => void;
  deleteProduct: (id: string) => void;
  searchProducts: (query: string) => FrequentProduct[];
  incrementAddCount: (productId: string) => void;
  initializeDefaultProducts: () => void;
  isInitialized: boolean;
}

export const useFrequentProductStore = create<FrequentProductState>()(
  persist(
    (set, get) => ({
      products: [],
      isInitialized: false,

      initializeDefaultProducts: () => {
        const { products, isInitialized } = get();

        // 既に初期化済みの場合は何もしない
        if (isInitialized || products.length > 0) {
          return;
        }

        const now = Date.now();
        const defaultProducts = initialProducts.map((product) => ({
          ...product,
          id: Crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
          addCount: 0,
        }));

        set({
          products: defaultProducts,
          isInitialized: true,
        });
      },

      addProduct: (product) => {
        try {
          const now = Date.now();
          const newProduct: FrequentProduct = {
            id: Crypto.randomUUID(),
            ...product,
            createdAt: now,
            updatedAt: now,
            addCount: 0,
          };

          set((state) => ({
            products: [...state.products, newProduct],
          }));
        } catch (error) {
          console.error('商品の追加に失敗しました:', error);
          // エラー処理ロジックをここに追加（例：エラー状態を設定）
        }
      },

      updateProduct: (id, product) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...product,
                  updatedAt: Date.now(),
                }
              : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      searchProducts: (query) => {
        const { products } = get();
        const normalizedQuery = query.toLowerCase().trim();

        return products.filter(
          (product) =>
            product.name.toLowerCase().includes(normalizedQuery) ||
            product.category?.toLowerCase().includes(normalizedQuery)
        );
      },

      incrementAddCount: (productId) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  addCount: (p.addCount || 0) + 1,
                  updatedAt: Date.now(),
                }
              : p
          ),
        }));
      },
    }),
    {
      name: 'frequent-products-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state && (!state.isInitialized || state.products.length === 0)) {
          // 初期データがない場合は初期化を実行
          setTimeout(() => {
            const store = useFrequentProductStore.getState();
            store.initializeDefaultProducts();
          }, 0);
        }
      },
      partialize: (state) => {
        // エラーを防ぐために永続化する前に状態を検証
        return {
          products: state.products.filter(
            (p) =>
              p &&
              typeof p === 'object' &&
              typeof p.id === 'string' &&
              typeof p.name === 'string'
          ),
        };
      },
    }
  )
);

export type FrequentProduct = {
  id: string;
  name: string;
  category?: string;
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
  defaultQuantity?: number;
  unit?: string;
  addCount: number;
};
