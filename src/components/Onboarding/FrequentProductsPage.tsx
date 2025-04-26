import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import frequentProductsGif from '../../assets/onboarding/frequent-products.gif';
import { Feature } from './Feature';

const FrequentProductsPage: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={frequentProductsGif}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          よく買う商品の管理
        </Text>
        <View style={styles.features}>
          <Feature
            icon="plus-circle"
            text="商品の登録・編集"
            color={colors.text.primary}
          />
          <Feature
            icon="format-list-bulleted"
            text="一括追加機能"
            color={colors.text.primary}
          />
          <Feature
            icon="image"
            text="商品画像の管理"
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
});

export default FrequentProductsPage;
