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
import { useShoppingHistoryStore, ShoppingHistoryEntry } from '../../src/stores/useShoppingHistoryStore';
import { useThemeContext } from '../../src/components/ThemeProvider';
import { HistoryDetailModal } from '../../src/components/HistoryDetailModal';
import { HistorySearchFilter } from '../../src/components/HistorySearchFilter';
import { HistoryStatsCard } from '../../src/components/HistoryStatsCard';
import { Ionicons } from '@expo/vector-icons';

// カテゴリIDから日本語名へのマッピング
const categoryNameMap: Record<string, string> = {
  'vegetables': '野菜',
  'meat-fish': '魚・肉',
  'daily': '日用品',
  'drink': '飲料',
  'other': 'その他',
  'uncategorized': 'その他',
  'none': 'その他',
};

// カテゴリー名を日本語に変換する関数
const getCategoryDisplayName = (categoryName: string): string => {
  return categoryNameMap[categoryName] || categoryName;
};

export default function HistoryScreen() {
  const { colors } = useThemeContext();
  const {
    histories,
    getHistoryByDate,
    getTotalStats,
    removeHistory,
  } = useShoppingHistoryStore();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // 初期選択日を今日に設定（ローカルタイムゾーン）
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  
  const [selectedHistory, setSelectedHistory] = useState<ShoppingHistoryEntry | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  
  // 検索とソートの状態
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'completion'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showAllHistories, setShowAllHistories] = useState(false);

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
  }, [selectedDate, getHistoryByDate, histories]);
  
  // 全履歴のフィルタリングとソート
  const filteredAndSortedHistories = useMemo(() => {
    let result = [...histories];
    
    // 検索フィルタ
    if (searchText.trim()) {
      result = result.filter(history => 
        history.listName.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // ソート
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.completedAt - b.completedAt;
          break;
        case 'name':
          comparison = a.listName.localeCompare(b.listName, 'ja-JP');
          break;
        case 'completion':
          comparison = a.completionRate - b.completionRate;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [histories, searchText, sortBy, sortDirection]);

  // 全体統計を取得
  const totalStats = useMemo(() => {
    return getTotalStats();
  }, [getTotalStats, histories]);
  
  // 今月の履歴数を計算
  const thisMonthHistories = useMemo(() => {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return histories.filter(history => 
      history.completedDate.startsWith(thisMonth)
    ).length;
  }, [histories]);

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
  
  // 履歴項目タップハンドラ
  const handleHistoryItemPress = (history: ShoppingHistoryEntry) => {
    setSelectedHistory(history);
    setIsDetailModalVisible(true);
  };
  
  // モーダルを閉じる
  const closeDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedHistory(null);
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
      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
        {/* 統計サマリー */}
        <HistoryStatsCard
          totalHistories={totalStats.totalHistories}
          thisMonthHistories={thisMonthHistories}
        />

        {/* カレンダー */}
        <View style={styles.calendarContainer}>
          <Calendar
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            markedDates={markedDates}
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
          <View style={styles.historyHeaderContent}>
            <Text style={[styles.historyTitle, { color: colors.text.primary }]}>
              {showAllHistories ? '全履歴' : formatSelectedDate(selectedDate)}
            </Text>
            {(showAllHistories ? filteredAndSortedHistories.length : selectedDateHistories.length) > 0 && (
              <Text style={[styles.historyCount, { color: colors.text.secondary }]}>
                {showAllHistories ? filteredAndSortedHistories.length : selectedDateHistories.length}件の履歴
              </Text>
            )}
          </View>
          
          <Pressable
            style={[
              styles.toggleButton,
              { 
                backgroundColor: showAllHistories ? colors.accent.primary : colors.background.secondary,
                borderColor: colors.border.primary,
              }
            ]}
            onPress={() => setShowAllHistories(!showAllHistories)}
          >
            <Text
              style={[
                styles.toggleButtonText,
                { color: showAllHistories ? colors.text.inverse : colors.text.primary }
              ]}
            >
              {showAllHistories ? 'カレンダー' : '全履歴'}
            </Text>
          </Pressable>
        </View>
        
        {/* 検索フィルタ（全履歴表示時のみ） */}
        {showAllHistories && (
          <HistorySearchFilter
            searchText={searchText}
            onSearchChange={setSearchText}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortDirection={sortDirection}
            onSortDirectionChange={setSortDirection}
          />
        )}

        <View style={styles.historyList}>
          {(showAllHistories ? filteredAndSortedHistories : selectedDateHistories).length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name={showAllHistories ? "search-outline" : "calendar-outline"}
                size={48}
                color={colors.text.tertiary}
              />
              <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
                {showAllHistories 
                  ? '検索結果がありません' 
                  : 'この日の履歴はありません'}
              </Text>
            </View>
          ) : (
            (showAllHistories ? filteredAndSortedHistories : selectedDateHistories).map((history) => (
              <Pressable
                key={history.id}
                style={[
                  styles.historyItem,
                  {
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary,
                  }
                ]}
                onPress={() => handleHistoryItemPress(history)}
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
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteHistory(history.id, history.listName);
                    }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={colors.state.error}
                    />
                  </Pressable>
                </View>

                <View style={styles.historyStats}>
                  <View style={[styles.statChip, { backgroundColor: colors.background.secondary }]}>
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
                        borderWidth: 1,
                        borderColor:
                          history.completionRate >= 80
                            ? '#34C759'
                            : history.completionRate >= 50
                            ? '#FF9500'
                            : '#FF3B30',
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
                          fontWeight: '600',
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
                          {getCategoryDisplayName(category.categoryName)}
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
                
                {/* 展開インジケーター */}
                <View style={styles.expandIndicator}>
                  <Text style={[styles.expandText, { color: colors.text.tertiary }]}>
                    タップして詳細を表示
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.text.tertiary}
                  />
                </View>
              </Pressable>
            ))
          )}
        </View>
        </View>
      </ScrollView>
      
      {/* 履歴詳細モーダル */}
      <HistoryDetailModal
        visible={isDetailModalVisible}
        onClose={closeDetailModal}
        history={selectedHistory}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainScroll: {
    flex: 1,
  },
  calendarContainer: {
    height: 380,
  },
  historyContainer: {
    paddingBottom: 20,
  },
  historyHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyHeaderContent: {
    flex: 1,
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
    paddingBottom: 20,
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
  expandIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingTop: 8,
    gap: 4,
  },
  expandText: {
    fontSize: 12,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});