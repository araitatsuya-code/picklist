import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface FeatureProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  text: string;
  color: string;
}

export const Feature: React.FC<FeatureProps> = ({ icon, text, color }) => (
  <View style={styles.featureItem}>
    <MaterialCommunityIcons name={icon} size={20} color={color} />
    <Text style={[styles.featureText, { color }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
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
