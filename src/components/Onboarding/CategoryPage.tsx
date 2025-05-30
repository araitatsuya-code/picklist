import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import categoryGif from '../../assets/onboarding/category.gif';
import { Feature } from './Feature';

const CategoryPage: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={categoryGif} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          カテゴリ管理と並び替え
        </Text>
        <View style={styles.features}>
          <Feature
            icon="shape-outline"
            text="カテゴリの作成・編集"
            color={colors.text.primary}
          />
          <Feature
            icon="sort"
            text="カテゴリ順での並び替え"
            color={colors.text.primary}
          />
          <Feature
            icon="drag"
            text="ドラッグ＆ドロップで並び替え"
            color={colors.text.primary}
          />
        </View>

        <View
          style={[styles.divider, { backgroundColor: colors.border.primary }]}
        />

        <Text style={[styles.title, { color: colors.text.primary }]}>
          ダークモード対応
        </Text>
        <View style={styles.features}>
          <Feature
            icon="theme-light-dark"
            text="システム設定に連動"
            color={colors.text.primary}
          />
          <Feature
            icon="brightness-6"
            text="手動での切り替えも可能"
            color={colors.text.primary}
          />
          <Feature
            icon="eye"
            text="目に優しい表示"
            color={colors.text.primary}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 1.5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  features: {
    width: '100%',
    gap: 12,
  },
  divider: {
    width: '100%',
    height: 1,
    marginVertical: 16,
  },
});

export default CategoryPage;
