import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const { width } = Dimensions.get('window');

interface OnboardingPagerProps {
  currentPage: number;
}

const OnboardingPager: React.FC<OnboardingPagerProps> = ({ currentPage }) => {
  const { theme } = useTheme();

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <View style={styles.page}>{/* ウェルカム画面のコンテンツ */}</View>
        );
      case 1:
        return <View style={styles.page}>{/* 買い物リスト機能の説明 */}</View>;
      case 2:
        return <View style={styles.page}>{/* よく買う商品機能の説明 */}</View>;
      case 3:
        return <View style={styles.page}>{/* その他の便利機能の説明 */}</View>;
      default:
        return null;
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
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
