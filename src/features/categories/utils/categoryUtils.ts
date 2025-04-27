import { Category } from '../../../stores/useCategoryStore';

export const findNextAvailablePriority = (categories: Category[]): number => {
  const usedPriorities = categories.map((c) => c.priority);
  let newPriority = 1;
  while (usedPriorities.includes(newPriority)) {
    newPriority++;
  }
  return newPriority;
};

export const handleCategoryMove = (
  categories: Category[],
  category: Category,
  direction: 'up' | 'down',
  onUpdate: (id: string, data: Partial<Category>) => void
) => {
  const sorted = [...categories].sort((a, b) => a.priority - b.priority);
  const currentIndex = sorted.findIndex((c) => c.id === category.id);

  if (direction === 'up' && currentIndex > 0) {
    const prevCategory = sorted[currentIndex - 1];
    onUpdate(category.id, { priority: prevCategory.priority });
    onUpdate(prevCategory.id, { priority: category.priority });
  } else if (direction === 'down' && currentIndex < sorted.length - 1) {
    const nextCategory = sorted[currentIndex + 1];
    onUpdate(category.id, { priority: nextCategory.priority });
    onUpdate(nextCategory.id, { priority: category.priority });
  }
};
