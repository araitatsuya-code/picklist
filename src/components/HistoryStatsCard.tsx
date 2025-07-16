import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from './ThemeProvider';

interface HistoryStatsCardProps {
  totalHistories: number;
  thisMonthHistories: number;
}

export const HistoryStatsCard: React.FC<HistoryStatsCardProps> = ({
  totalHistories,
  thisMonthHistories,
}) => {
  const { colors } = useThemeContext();

  const stats = [
    {
      icon: 'list-outline',
      label: '総履歴数',
      value: totalHistories.toString(),
      color: colors.accent.primary,
    },
    {
      icon: 'trending-up-outline',
      label: '今月の履歴',
      value: thisMonthHistories.toString(),
      color: '#FF9500',
    },
  ];

  return (
    <View
      style={[
        styles.container,
        { 
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.secondary,
        }
      ]}
    >
      <Text style={[styles.title, { color: colors.text.primary }]}>
        統計サマリー
      </Text>
      
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
              <Ionicons
                name={stat.icon as 'list-outline' | 'trending-up-outline'}
                size={24}
                color={stat.color}
              />
            </View>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});