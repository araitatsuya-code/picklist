import { Category } from '../../stores/useCategoryStore';

export interface CategoryColors {
  accent: {
    primary: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  background: {
    primary: string;
  };
  border: {
    primary: string;
    secondary: string;
  };
  state: {
    error: string;
  };
}

export interface CategoryItemProps {
  category: Category;
  updateCategory: (id: string, data: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  isRemovable: boolean;
  colors: CategoryColors;
  isDark: boolean;
  textColor: string;
  secondaryTextColor: string;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: 'up' | 'down') => void;
}
