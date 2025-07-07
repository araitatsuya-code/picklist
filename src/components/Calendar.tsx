import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from './ThemeProvider';

interface CalendarProps {
  onDateSelect: (date: string) => void;
  selectedDate?: string;
  markedDates?: string[]; // 履歴がある日付
  minDate?: Date;
  maxDate?: Date;
}

interface DayInfo {
  date: string; // YYYY-MM-DD
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasHistory: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({
  onDateSelect,
  selectedDate,
  markedDates = [],
  minDate,
  maxDate,
}) => {
  const { colors } = useThemeContext();
  const [currentDate, setCurrentDate] = useState(new Date());

  // 今日の日付
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // 現在の年月
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 月の名前
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  // 曜日の名前
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  // カレンダーの日付データを生成
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);

    // 週の最初を日曜日に合わせる
    startDate.setDate(startDate.getDate() - startDate.getDay());
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days: DayInfo[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const isCurrentMonth = current.getMonth() === currentMonth;
      const isToday = dateStr === todayStr;
      const isSelected = dateStr === selectedDate;
      const hasHistory = markedDates.includes(dateStr);

      // 日付範囲チェック
      let isDisabled = false;
      if (minDate && current < minDate) isDisabled = true;
      if (maxDate && current > maxDate) isDisabled = true;

      if (!isDisabled) {
        days.push({
          date: dateStr,
          day: current.getDate(),
          isCurrentMonth,
          isToday,
          isSelected,
          hasHistory,
        });
      }

      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [currentYear, currentMonth, selectedDate, markedDates, todayStr, minDate, maxDate]);

  // 前月への移動
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // 次月への移動
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // 日付選択
  const handleDatePress = (dayInfo: DayInfo) => {
    if (!dayInfo.isCurrentMonth) return;
    onDateSelect(dayInfo.date);
  };

  // 今月に移動
  const goToCurrentMonth = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* ヘッダー */}
      <View style={[styles.header, { borderBottomColor: colors.border.secondary }]}>
        <Pressable
          style={styles.navigationButton}
          onPress={goToPreviousMonth}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.text.primary}
          />
        </Pressable>
        
        <Pressable
          style={styles.monthYearContainer}
          onPress={goToCurrentMonth}
        >
          <Text style={[styles.monthYear, { color: colors.text.primary }]}>
            {currentYear}年 {monthNames[currentMonth]}
          </Text>
        </Pressable>
        
        <Pressable
          style={styles.navigationButton}
          onPress={goToNextMonth}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.text.primary}
          />
        </Pressable>
      </View>

      {/* 曜日ヘッダー */}
      <View style={styles.weekHeader}>
        {dayNames.map((dayName, index) => (
          <View key={dayName} style={styles.dayHeaderContainer}>
            <Text
              style={[
                styles.dayHeader,
                { color: colors.text.secondary },
                index === 0 && { color: '#FF3B30' }, // 日曜日は赤
                index === 6 && { color: '#007AFF' }, // 土曜日は青
              ]}
            >
              {dayName}
            </Text>
          </View>
        ))}
      </View>

      {/* カレンダーグリッド */}
      <ScrollView style={styles.calendarScroll}>
        <View style={styles.calendarGrid}>
          {calendarDays.map((dayInfo) => (
            <Pressable
              key={dayInfo.date}
              style={[
                styles.dayContainer,
                dayInfo.isSelected && {
                  backgroundColor: colors.accent.primary,
                },
                dayInfo.isToday && !dayInfo.isSelected && {
                  borderColor: colors.accent.primary,
                  borderWidth: 2,
                },
              ]}
              onPress={() => handleDatePress(dayInfo)}
              disabled={!dayInfo.isCurrentMonth}
            >
              <Text
                style={[
                  styles.dayText,
                  { color: colors.text.primary },
                  !dayInfo.isCurrentMonth && {
                    color: colors.text.tertiary,
                  },
                  dayInfo.isSelected && {
                    color: colors.text.inverse,
                    fontWeight: '600',
                  },
                  dayInfo.isToday && !dayInfo.isSelected && {
                    color: colors.accent.primary,
                    fontWeight: '600',
                  },
                ]}
              >
                {dayInfo.day}
              </Text>
              
              {/* 履歴がある日付のマーク */}
              {dayInfo.hasHistory && (
                <View
                  style={[
                    styles.historyDot,
                    {
                      backgroundColor: dayInfo.isSelected
                        ? colors.text.inverse
                        : colors.accent.primary,
                    },
                  ]}
                />
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* フッター情報 */}
      <View style={[styles.footer, { borderTopColor: colors.border.secondary }]}>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: colors.accent.primary },
              ]}
            />
            <Text style={[styles.legendText, { color: colors.text.secondary }]}>
              履歴あり
            </Text>
          </View>
          
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendCircle,
                { borderColor: colors.accent.primary },
              ]}
            />
            <Text style={[styles.legendText, { color: colors.text.secondary }]}>
              今日
            </Text>
          </View>
        </View>
        
        {/* カレンダー操作説明 */}
        <Text style={[styles.footerHint, { color: colors.text.tertiary }]}>
          日付をタップして履歴を表示 • 月名をタップして今月に戻る
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  navigationButton: {
    padding: 8,
    borderRadius: 8,
  },
  monthYearContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '600',
  },
  weekHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  dayHeaderContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeader: {
    fontSize: 14,
    fontWeight: '500',
  },
  calendarScroll: {
    flex: 1,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
  },
  dayContainer: {
    width: '14.28%', // 7日で100%
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 2,
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    textAlign: 'center',
  },
  historyDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
  legendText: {
    fontSize: 12,
  },
  footerHint: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
});