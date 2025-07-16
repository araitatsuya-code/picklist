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
      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
              <Ionicons
                name={stat.icon as 'list-outline' | 'trending-up-outline'}
                size={20}
                color={stat.color}
              />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                {stat.label}
              </Text>
            </View>
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
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'left',
  },
});