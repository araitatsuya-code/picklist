import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FrequentProduct } from '../types/frequentProduct';

interface FrequentProductState {
  products: FrequentProduct[];
  addProduct: (
    product: Omit<FrequentProduct, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  updateProduct: (id: string, product: Partial<FrequentProduct>) => void;
  deleteProduct: (id: string) => void;
  searchProducts: (query: string) => FrequentProduct[];
}

export const useFrequentProductStore = create<FrequentProductState>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (product) => {
        const now = Date.now();
        const newProduct: FrequentProduct = {
          id: now.toString(),
          ...product,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          products: [...state.products, newProduct],
        }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, ...updates, updatedAt: Date.now() }
              : product
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
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
    }),
    {
      name: 'frequent-products-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        console.log('State hydrated:', state?.products.length ?? 0, 'products');
      },
    }
  )
);
