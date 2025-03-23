export type FrequentProduct = {
  id: string;
  name: string;
  imageUrl?: string | null;
  category?: string;
  defaultQuantity?: number;
  unit?: string;
  createdAt: number;
  updatedAt: number;
  addCount: number;
};
