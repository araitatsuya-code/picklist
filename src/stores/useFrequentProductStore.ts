import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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

      addProduct: (product) =>
        set((state) => {
          const now = Date.now();
          const newProduct: FrequentProduct = {
            ...product,
            id: `product_${now}`,
            createdAt: now,
            updatedAt: now,
          };
          return { products: [...state.products, newProduct] };
        }),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, ...updates, updatedAt: Date.now() }
              : product
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),

      searchProducts: (query) => {
        const { products } = get();
        const lowerQuery = query.toLowerCase();
        return products.filter(
          (product) =>
            product.name.toLowerCase().includes(lowerQuery) ||
            product.barcode?.includes(query) ||
            product.category?.toLowerCase().includes(lowerQuery)
        );
      },
    }),
    {
      name: 'frequent-products-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
