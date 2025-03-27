import { PicklistItem } from '../stores/usePicklistStore';
import { Category } from '../stores/useCategoryStore';

/**
 * カテゴリの優先順位に基づいてアイテムをソートする
 */
export const sortByCategory = (
  items: PicklistItem[],
  categories: Category[],
  direction: 'asc' | 'desc' = 'asc'
): PicklistItem[] => {
  const categoryMap = new Map(
    categories.map((category) => [category.id, category.priority])
  );

  return [...items].sort((a, b) => {
    const aPriority =
      categoryMap.get(a.category || 'other') || Number.MAX_VALUE;
    const bPriority =
      categoryMap.get(b.category || 'other') || Number.MAX_VALUE;
    if (aPriority !== bPriority) {
      const result = aPriority - bPriority;
      return direction === 'asc' ? result : -result;
    }
    return a.name.localeCompare(b.name);
  });
};

/**
 * アイテムの優先順位でソートする
 */
export const sortByPriority = (
  items: PicklistItem[],
  direction: 'asc' | 'desc' = 'asc'
): PicklistItem[] => {
  return [...items].sort((a, b) => {
    if (a.priority !== b.priority) {
      const result = a.priority - b.priority;
      return direction === 'asc' ? result : -result;
    }
    return a.name.localeCompare(b.name);
  });
};

/**
 * アイテム名でソートする
 */
export const sortByName = (
  items: PicklistItem[],
  direction: 'asc' | 'desc' = 'asc'
): PicklistItem[] => {
  return [...items].sort((a, b) => {
    const result = a.name.localeCompare(b.name);
    return direction === 'asc' ? result : -result;
  });
};

/**
 * カテゴリでグループ化してソートする
 */
export const groupAndSortByCategory = (
  items: PicklistItem[],
  categories: Category[],
  direction: 'asc' | 'desc' = 'asc'
): { category: Category; items: PicklistItem[] }[] => {
  const categoryMap = new Map(
    categories.map((category) => [category.id, category])
  );

  // カテゴリーごとにアイテムをグループ化
  const itemsByCategory = new Map<string, PicklistItem[]>();
  const uncategorizedItems: PicklistItem[] = [];

  items.forEach((item) => {
    if (!item.category || !categoryMap.has(item.category)) {
      uncategorizedItems.push(item);
    } else {
      if (!itemsByCategory.has(item.category)) {
        itemsByCategory.set(item.category, []);
      }
      itemsByCategory.get(item.category)?.push(item);
    }
  });

  // カテゴリーごとにソートして結果を生成
  const sortedGroups = categories
    .filter((category) => {
      const categoryItems = itemsByCategory.get(category.id);
      return categoryItems && categoryItems.length > 0;
    })
    .map((category) => ({
      category,
      items: (itemsByCategory.get(category.id) || []).sort((a, b) => {
        if (a.priority !== b.priority) {
          const result = a.priority - b.priority;
          return direction === 'asc' ? result : -result;
        }
        return a.name.localeCompare(b.name);
      }),
    }));

  // その他のカテゴリーがある場合は追加
  if (uncategorizedItems.length > 0) {
    sortedGroups.push({
      category: {
        id: 'other',
        name: 'その他',
        priority: Number.MAX_VALUE,
        displayOrder: Number.MAX_VALUE,
      },
      items: uncategorizedItems.sort((a, b) => {
        if (a.priority !== b.priority) {
          const result = a.priority - b.priority;
          return direction === 'asc' ? result : -result;
        }
        return a.name.localeCompare(b.name);
      }),
    });
  }

  // カテゴリーの優先順位でソート
  return sortedGroups.sort((a, b) => {
    const result = (a.category.priority || 0) - (b.category.priority || 0);
    return direction === 'asc' ? result : -result;
  });
};

export const sortByCreated = (
  items: PicklistItem[],
  direction: 'asc' | 'desc' = 'asc'
): PicklistItem[] => {
  return [...items].sort((a, b) => {
    const result = (a.id || '').localeCompare(b.id || '');
    return direction === 'asc' ? result : -result;
  });
};
