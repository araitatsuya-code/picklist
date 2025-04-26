import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import WelcomePage from './WelcomePage';
import ShoppingListPage from './ShoppingListPage';
import CategoryPage from './CategoryPage';
import FrequentProductsPage from './FrequentProductsPage';

const { width } = Dimensions.get('window');

interface OnboardingPagerProps {
  currentPage: number;
}

const OnboardingPager: React.FC<OnboardingPagerProps> = ({ currentPage }) => {
  const { colors } = useTheme();

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return <WelcomePage />;
      case 1:
        return <ShoppingListPage />;
      case 2:
        return <CategoryPage />;
      case 3:
        return <FrequentProductsPage />;
      default:
        return null;
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {renderPage()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  page: {
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnboardingPager;
