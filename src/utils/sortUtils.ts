import { PicklistItem } from '../stores/usePicklistStore';
import { Category } from '../stores/useCategoryStore';

/**
 * カテゴリの優先順位に基づいてアイテムをソートする
 */
export const sortByCategory = (
  items: PicklistItem[],
  categories: Category[]
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
      return aPriority - bPriority;
    }
    return a.name.localeCompare(b.name);
  });
};

/**
 * アイテムの優先順位でソートする
 */
export const sortByPriority = (items: PicklistItem[]): PicklistItem[] => {
  return [...items].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.name.localeCompare(b.name);
  });
};

/**
 * アイテム名でソートする
 */
export const sortByName = (items: PicklistItem[]): PicklistItem[] => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * カテゴリでグループ化してソートする
 */
export const groupAndSortByCategory = (
  items: PicklistItem[],
  categories: Category[]
): { category: Category; items: PicklistItem[] }[] => {
  const categoryMap = new Map(
    categories.map((category) => [category.id, category])
  );
  const itemsByCategory = new Map<string, PicklistItem[]>();

  // カテゴリごとにアイテムをグループ化
  items.forEach((item) => {
    const categoryId = item.category || 'other';
    if (!itemsByCategory.has(categoryId)) {
      itemsByCategory.set(categoryId, []);
    }
    itemsByCategory.get(categoryId)?.push(item);
  });

  // カテゴリごとにソートして結果を生成
  return categories
    .filter((category) => {
      const categoryItems = itemsByCategory.get(category.id);
      return categoryItems && categoryItems.length > 0;
    })
    .map((category) => ({
      category: categoryMap.get(category.id) || category,
      items: (itemsByCategory.get(category.id) || []).sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        return a.name.localeCompare(b.name);
      }),
    }));
};
