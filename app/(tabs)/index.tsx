import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { usePicklistStore } from '../../src/stores/usePicklistStore';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';

export default function PicklistScreen() {
  const picklists = usePicklistStore((state) => state.picklists);
  const { addPicklist, removePicklist } = usePicklistStore();
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background.secondary },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.listContainer}>
          <Pressable
            style={styles.createButton}
            onPress={() => addPicklist('新しいリスト')}
          >
            <LinearGradient
              colors={isDark ? ['#0A84FF', '#0A84FF'] : ['#007AFF', '#00A2FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Ionicons name="add" size={24} color="#FFF" />
              <Text style={styles.createButtonText}>新規リスト作成</Text>
            </LinearGradient>
          </Pressable>

          {picklists.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cart" size={64} color={colors.text.tertiary} />
              <Text
                style={[styles.emptyText, { color: colors.text.secondary }]}
              >
                買い物リストを作成してください
              </Text>
            </View>
          ) : (
            picklists.map((list) => (
              <View
                key={list.id}
                style={[
                  styles.card,
                  { backgroundColor: colors.card.background },
                ]}
              >
                <Link href={`/list/${list.id}`} asChild>
                  <Pressable style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardTitleContainer}>
                        <Ionicons
                          name="list"
                          size={24}
                          color={colors.accent.primary}
                          style={styles.cardIcon}
                        />
                        <Text
                          style={[
                            styles.cardTitle,
                            { color: colors.text.primary },
                          ]}
                        >
                          {list.name}
                        </Text>
                      </View>
                      <Pressable
                        style={styles.deleteButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          Alert.alert(
                            '確認',
                            `「${list.name}」を削除してもよろしいですか？`,
                            [
                              { text: 'キャンセル', style: 'cancel' },
                              {
                                text: '削除',
                                style: 'destructive',
                                onPress: () => removePicklist(list.id),
                              },
                            ]
                          );
                        }}
                      >
                        <View
                          style={[
                            styles.deleteIconContainer,
                            { backgroundColor: colors.accent.tertiary },
                          ]}
                        >
                          <Ionicons
                            name="close"
                            size={16}
                            color={colors.state.error}
                          />
                        </View>
                      </Pressable>
                    </View>
                    <Text
                      style={[
                        styles.itemCount,
                        { color: colors.text.secondary },
                      ]}
                    >
                      {list.items.length}個のアイテム
                    </Text>
                  </Pressable>
                </Link>
              </View>
            ))
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    flex: 1,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  createButton: {
    marginBottom: 16,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  card: {
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  itemCount: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  deleteIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
