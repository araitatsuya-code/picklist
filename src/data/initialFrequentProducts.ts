import { FrequentProduct } from '../stores/useFrequentProductStore';
import * as Crypto from 'expo-crypto';

const now = Date.now();

export const initialProducts: Omit<
  FrequentProduct,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  {
    name: '牛乳',
    category: '飲料',
    defaultQuantity: 1,
    unit: '本',
  },
  {
    name: '食パン',
    category: 'パン',
    defaultQuantity: 1,
    unit: '袋',
  },
  {
    name: 'バナナ',
    category: '果物',
    defaultQuantity: 1,
    unit: '房',
  },
  {
    name: '卵',
    category: '食品',
    defaultQuantity: 1,
    unit: 'パック',
  },
  {
    name: 'トイレットペーパー',
    category: '日用品',
    defaultQuantity: 1,
    unit: 'パック',
  },
  {
    name: 'ティッシュペーパー',
    category: '日用品',
    defaultQuantity: 1,
    unit: '箱',
  },
];
