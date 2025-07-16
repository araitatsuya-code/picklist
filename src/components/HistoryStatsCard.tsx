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
  averageCompletionRate: number;
  activeDays: number;
  thisMonthHistories: number;
}

export const HistoryStatsCard: React.FC<HistoryStatsCardProps> = ({
  totalHistories,
  averageCompletionRate,
  activeDays,
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
      icon: 'checkmark-circle-outline',
      label: '平均完了率',
      value: `${averageCompletionRate}%`,
      color: averageCompletionRate >= 80 ? '#34C759' : averageCompletionRate >= 50 ? '#FF9500' : '#FF3B30',
    },
    {
      icon: 'calendar-outline',
      label: '活動日数',
      value: activeDays.toString(),
      color: '#007AFF',
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
                name={stat.icon as 'list-outline' | 'checkmark-circle-outline' | 'calendar-outline' | 'trending-up-outline'}
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
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});