import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import shoppingListGif from '../../assets/onboarding/shopping-list.gif';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ShoppingListPage: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={shoppingListGif}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          買い物リストを簡単管理
        </Text>
        <View style={styles.features}>
          <Feature
            icon="format-list-checks"
            text="複数のリストを作成・管理"
            color={colors.text.primary}
          />
          <Feature
            icon="sort"
            text="カテゴリー別に自動で整理"
            color={colors.text.primary}
          />
          <Feature
            icon="gesture-tap"
            text="タップで完了・未完了を切り替え"
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
    <MaterialCommunityIcons name={icon} size={24} color={color} />
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
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  content: {
    width: '100%',
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  features: {
    width: '100%',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ShoppingListPage;
