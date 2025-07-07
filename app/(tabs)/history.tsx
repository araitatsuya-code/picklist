import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Calendar } from '../../src/components/Calendar';
import { useShoppingHistoryStore } from '../../src/stores/useShoppingHistoryStore';
import { useThemeContext } from '../../src/components/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const { colors } = useThemeContext();
  const histories = useShoppingHistoryStore((state) => state.histories);
  const getHistoryByDate = useShoppingHistoryStore((state) => state.getHistoryByDate);
  const getTotalStats = useShoppingHistoryStore((state) => state.getTotalStats);
  const removeHistory = useShoppingHistoryStore((state) => state.removeHistory);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // 初期選択日を今日に設定
    return new Date().toISOString().split('T')[0];
  });

  // 履歴がある日付のリストを取得
  const markedDates = useMemo(() => {
    const dates = new Set<string>();
    histories.forEach(history => {
      dates.add(history.completedDate);
    });
    return Array.from(dates);
  }, [histories]);

  // 選択した日付の履歴を取得
  const selectedDateHistories = useMemo(() => {
    return getHistoryByDate(selectedDate);
  }, [selectedDate, getHistoryByDate, histories]); // historiesを依存配列に追加

  // 全体統計を取得
  const totalStats = useMemo(() => {
    return getTotalStats();
  }, [getTotalStats, histories]); // historiesを依存配列に追加

  // 日付選択ハンドラ
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  // 履歴削除ハンドラ
  const handleDeleteHistory = (historyId: string, listName: string) => {
    Alert.alert(
      '履歴を削除',
      `「${listName}」の履歴を削除しますか？`,
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => removeHistory(historyId),
        },
      ]
    );
  };

  // 時刻をフォーマット
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 日付をフォーマット
  const formatSelectedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* 統計サマリー */}
      <View
        style={[
          styles.statsContainer,
          { 
            backgroundColor: colors.background.secondary,
            borderBottomColor: colors.border.secondary,
          }
        ]}
      >
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>
              {totalStats.totalHistories}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              総履歴数
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>
              {totalStats.averageCompletionRate}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              平均完了率
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>
              {markedDates.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              活動日数
            </Text>
          </View>
        </View>
      </View>

      {/* カレンダー */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
          markedDates={markedDates}
          maxDate={new Date()} // 今日まで
        />
      </View>

      {/* 選択した日付の履歴 */}
      <View style={styles.historyContainer}>
        <View
          style={[
            styles.historyHeader,
            { borderBottomColor: colors.border.secondary }
          ]}
        >
          <Text style={[styles.historyTitle, { color: colors.text.primary }]}>
            {formatSelectedDate(selectedDate)}
          </Text>
          {selectedDateHistories.length > 0 && (
            <Text style={[styles.historyCount, { color: colors.text.secondary }]}>
              {selectedDateHistories.length}件の履歴
            </Text>
          )}
        </View>

        <ScrollView style={styles.historyList}>
          {selectedDateHistories.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="calendar-outline"
                size={48}
                color={colors.text.tertiary}
              />
              <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
                この日の履歴はありません
              </Text>
            </View>
          ) : (
            selectedDateHistories.map((history) => {
              console.log('=== Rendering history ===');
              console.log('History ID:', history.id);
              console.log('History items:', history.items);
              console.log('Items length:', history.items.length);
              return (
              <View
                key={history.id}
                style={[
                  styles.historyItem,
                  {
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary,
                  }
                ]}
              >
                <View style={styles.historyItemHeader}>
                  <View style={styles.historyItemInfo}>
                    <Text
                      style={[styles.historyListName, { color: colors.text.primary }]}
                    >
                      {history.listName}
                    </Text>
                    <Text
                      style={[styles.historyTime, { color: colors.text.secondary }]}
                    >
                      {formatTime(history.completedAt)}
                    </Text>
                  </View>
                  
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() =>
                      handleDeleteHistory(history.id, history.listName)
                    }
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color="#FF3B30"
                    />
                  </Pressable>
                </View>

                <View style={styles.historyStats}>
                  <View style={styles.statChip}>
                    <Text
                      style={[styles.statChipText, { color: colors.text.secondary }]}
                    >
                      {history.completedItems}/{history.totalItems} 完了
                    </Text>
                  </View>
                  
                  <View
                    style={[
                      styles.statChip,
                      {
                        backgroundColor:
                          history.completionRate >= 80
                            ? '#34C759' + '20'
                            : history.completionRate >= 50
                            ? '#FF9500' + '20'
                            : '#FF3B30' + '20',
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.statChipText,
                        {
                          color:
                            history.completionRate >= 80
                              ? '#34C759'
                              : history.completionRate >= 50
                              ? '#FF9500'
                              : '#FF3B30',
                        }
                      ]}
                    >
                      {history.completionRate}%
                    </Text>
                  </View>
                </View>

                {/* カテゴリー別サマリー */}
                {history.categoryBreakdown.length > 0 && (
                  <View style={styles.categoryBreakdown}>
                    {history.categoryBreakdown.map((category) => (
                      <View key={category.categoryId} style={styles.categoryItem}>
                        <Text
                          style={[
                            styles.categoryName,
                            { color: colors.text.secondary }
                          ]}
                        >
                          {category.categoryName}
                        </Text>
                        <Text
                          style={[
                            styles.categoryStats,
                            { color: colors.text.tertiary }
                          ]}
                        >
                          {category.completedItems}/{category.totalItems}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* 商品リスト */}
                {history.items.length > 0 && (
                  <View style={styles.itemsList}>
                    <Text style={[styles.itemsTitle, { color: colors.text.primary }]}>
                      商品一覧 ({history.items.length}個)
                    </Text>
                    <View style={styles.itemsGrid}>
                      {history.items.slice(0, 6).map((item) => (
                        <View
                          key={item.id}
                          style={[
                            styles.itemChip,
                            {
                              backgroundColor: item.completed 
                                ? colors.accent.primary + '15' 
                                : colors.background.secondary,
                              borderColor: item.completed 
                                ? colors.accent.primary 
                                : colors.border.secondary,
                            }
                          ]}
                        >
                          <Ionicons
                            name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                            size={14}
                            color={item.completed ? colors.accent.primary : colors.text.tertiary}
                          />
                          <Text
                            style={[
                              styles.itemChipText,
                              { 
                                color: item.completed ? colors.text.primary : colors.text.secondary,
                              },
                              item.completed && styles.itemChipTextCompleted,
                            ]}
                            numberOfLines={1}
                          >
                            {item.name}
                          </Text>
                        </View>
                      ))}
                      {history.items.length > 6 && (
                        <View
                          style={[
                            styles.itemChip,
                            styles.moreItemsChip,
                            { backgroundColor: colors.background.secondary, borderColor: colors.border.secondary }
                          ]}
                        >
                          <Text style={[styles.moreItemsText, { color: colors.text.secondary }]}>
                            +{history.items.length - 6}個
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            )})
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  calendarContainer: {
    flex: 1,
    maxHeight: 400,
  },
  historyContainer: {
    flex: 1,
    minHeight: 200,
  },
  historyHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  historyCount: {
    fontSize: 14,
    marginTop: 2,
  },
  historyList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
  historyItem: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  historyItemInfo: {
    flex: 1,
  },
  historyListName: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyTime: {
    fontSize: 14,
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
  historyStats: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F2F2F7',
  },
  statChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryBreakdown: {
    marginTop: 8,
    gap: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 12,
  },
  categoryStats: {
    fontSize: 12,
  },
  itemsList: {
    marginTop: 12,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  itemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
    maxWidth: '48%',
  },
  itemChipText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  itemChipTextCompleted: {
    textDecorationLine: 'line-through',
  },
  moreItemsChip: {
    justifyContent: 'center',
  },
  moreItemsText: {
    fontSize: 12,
    fontWeight: '500',
  },
});