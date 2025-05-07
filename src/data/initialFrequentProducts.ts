import { FrequentProduct } from '../stores/useFrequentProductStore';

export const initialProducts: Omit<
  FrequentProduct,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  {
    name: '牛乳',
    category: 'drink',
    defaultQuantity: 1,
    unit: '本',
    addCount: 0,
  },
  {
    name: 'トイレットペーパー',
    category: 'daily',
    defaultQuantity: 1,
    unit: 'パック',
    addCount: 0,
  },
  {
    name: 'ティッシュペーパー',
    category: 'daily',
    defaultQuantity: 1,
    unit: '箱',
    addCount: 0,
  },
];
