import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from './ThemeProvider';
import { ShoppingHistoryEntry } from '../stores/useShoppingHistoryStore';

interface HistoryDetailModalProps {
  visible: boolean;
  onClose: () => void;
  history: ShoppingHistoryEntry | null;
}

export const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({
  visible,
  onClose,
  history,
}) => {
  const { colors } = useThemeContext();

  if (!history) return null;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        {/* ヘッダー */}
        <View style={[styles.header, { borderBottomColor: colors.border.secondary }]}>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            履歴詳細
          </Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          {/* 基本情報 */}
          <View style={[styles.section, { borderBottomColor: colors.border.secondary }]}>
            <Text style={[styles.listName, { color: colors.text.primary }]}>
              {history.listName}
            </Text>
            <Text style={[styles.completedAt, { color: colors.text.secondary }]}>
              {formatTime(history.completedAt)}
            </Text>
          </View>

          {/* 統計情報 */}
          <View style={[styles.section, { borderBottomColor: colors.border.secondary }]}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              統計
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                  完了率
                </Text>
                <Text
                  style={[
                    styles.statValue,
                    {
                      color:
                        history.completionRate >= 80
                          ? '#34C759'
                          : history.completionRate >= 50
                          ? '#FF9500'
                          : '#FF3B30',
                    },
                  ]}
                >
                  {history.completionRate}%
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                  完了アイテム
                </Text>
                <Text style={[styles.statValue, { color: colors.text.primary }]}>
                  {history.completedItems}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                  総アイテム
                </Text>
                <Text style={[styles.statValue, { color: colors.text.primary }]}>
                  {history.totalItems}
                </Text>
              </View>
            </View>
          </View>

          {/* カテゴリー別統計 */}
          {history.categoryBreakdown.length > 0 && (
            <View style={[styles.section, { borderBottomColor: colors.border.secondary }]}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                カテゴリー別統計
              </Text>
              {history.categoryBreakdown.map((category) => (
                <View key={category.categoryId} style={styles.categoryRow}>
                  <Text style={[styles.categoryName, { color: colors.text.primary }]}>
                    {category.categoryName}
                  </Text>
                  <View style={styles.categoryStats}>
                    <Text style={[styles.categoryProgress, { color: colors.text.secondary }]}>
                      {category.completedItems}/{category.totalItems}
                    </Text>
                    <Text
                      style={[
                        styles.categoryRate,
                        {
                          color:
                            category.completionRate >= 80
                              ? '#34C759'
                              : category.completionRate >= 50
                              ? '#FF9500'
                              : '#FF3B30',
                        },
                      ]}
                    >
                      {category.completionRate}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* アイテム一覧 */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              アイテム一覧
            </Text>
            {history.items.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  {
                    backgroundColor: item.completed
                      ? colors.accent.primary + '10'
                      : colors.background.secondary,
                    borderColor: colors.border.secondary,
                  },
                ]}
              >
                <View style={styles.itemLeft}>
                  <Ionicons
                    name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={item.completed ? colors.accent.primary : colors.text.tertiary}
                  />
                  <Text
                    style={[
                      styles.itemName,
                      { color: colors.text.primary },
                      item.completed && styles.itemNameCompleted,
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
                <View style={styles.itemRight}>
                  <Text style={[styles.itemQuantity, { color: colors.text.secondary }]}>
                    {item.quantity}{item.unit || '個'}
                  </Text>
                  {item.maxPrice && (
                    <Text style={[styles.itemPrice, { color: colors.text.tertiary }]}>
                      ¥{item.maxPrice}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  listName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  completedAt: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryProgress: {
    fontSize: 14,
  },
  categoryRate: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemNameCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 12,
    marginTop: 2,
  },
});