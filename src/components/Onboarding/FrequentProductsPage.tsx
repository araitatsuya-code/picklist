import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import frequentProductsGif from '../../assets/onboarding/frequent-products.gif';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
          よく使う商品機能
        </Text>
        <View style={styles.features}>
          <Feature
            icon="plus-circle"
            text="よく使う商品を登録・編集して"
            color={colors.text.primary}
          />
          <Feature
            icon="magnify"
            text="商品の検索"
            color={colors.text.primary}
          />
          <Feature
            icon="format-list-bulleted"
            text="カテゴリーでの絞り込み"
            color={colors.text.primary}
          />
          <Feature
            icon="cart-plus"
            text="買い物リストへの一括追加"
            color={colors.text.primary}
          />
        </View>
      </View>
    </View>
  );
};

interface FeatureProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  text: string;
  color: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, text, color }) => (
  <View style={styles.featureItem}>
    <MaterialCommunityIcons name={icon} size={20} color={color} />
    <Text style={[styles.featureText, { color }]}>{text}</Text>
  </View>
);

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
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default FrequentProductsPage;
