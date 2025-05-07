import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { List } from 'react-native-paper';
import { router } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { useState, Fragment } from 'react';

export default function SettingsScreen() {
  const { colors, isDark, setTheme, followSystem, setFollowSystem } =
    useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);

  // テーマの表示テキスト
  const getThemeText = () => {
    if (followSystem) {
      return 'システム設定に従う';
    }
    return isDark ? 'オン' : 'オフ';
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background.secondary },
      ]}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            一般
          </Text>

          <View
            style={[
              styles.menuList,
              {
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary,
              },
            ]}
          >
            <Pressable
              style={[
                styles.menuItem,
                { borderBottomColor: colors.border.secondary },
              ]}
            >
              <View style={styles.menuContent}>
                <Ionicons
                  name="language-outline"
                  size={24}
                  color={colors.text.secondary}
                />
                <Text style={[styles.menuText, { color: colors.text.primary }]}>
                  言語
                </Text>
              </View>
              <View style={styles.menuRight}>
                <Text
                  style={[styles.menuValue, { color: colors.text.secondary }]}
                >
                  日本語
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.text.secondary}
                />
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.menuItem,
                { borderBottomColor: colors.border.secondary },
              ]}
              onPress={() => setShowThemeModal(true)}
            >
              <View style={styles.menuContent}>
                <Ionicons
                  name={isDark ? 'moon' : 'moon-outline'}
                  size={24}
                  color={colors.text.secondary}
                />
                <Text style={[styles.menuText, { color: colors.text.primary }]}>
                  ダークモード
                </Text>
              </View>
              <View style={styles.menuRight}>
                <Text
                  style={[styles.menuValue, { color: colors.text.secondary }]}
                >
                  {getThemeText()}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.text.secondary}
                />
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            データ管理
          </Text>

          <View
            style={[
              styles.menuList,
              {
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary,
              },
            ]}
          >
            {/*
            <Pressable
              style={[
                styles.menuItem,
                { borderBottomColor: colors.border.secondary },
              ]}
            >
              <View style={styles.menuContent}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={24}
                  color={colors.text.secondary}
                />
                <Text style={[styles.menuText, { color: colors.text.primary }]}> 
                  データのエクスポート
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.secondary}
              />
            </Pressable>

            <Pressable
              style={[
                styles.menuItem,
                { borderBottomColor: colors.border.secondary },
              ]}
            >
              <View style={styles.menuContent}>
                <Ionicons
                  name="cloud-download-outline"
                  size={24}
                  color={colors.text.secondary}
                />
                <Text style={[styles.menuText, { color: colors.text.primary }]}> 
                  データのインポート
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.secondary}
              />
            </Pressable>
            */}

            <Pressable
              style={[styles.menuItem, styles.dangerItem]}
              onPress={() => {
                Alert.alert(
                  'データの削除',
                  '全てのデータを削除しますか？この操作は元に戻せません。',
                  [
                    { text: 'キャンセル', style: 'cancel' },
                    {
                      text: '削除',
                      style: 'destructive',
                      onPress: () => {
                        /* 削除処理を実装 */
                      },
                    },
                  ]
                );
              }}
            >
              <View style={styles.menuContent}>
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={colors.state.error}
                />
                <Text
                  style={[styles.dangerText, { color: colors.state.error }]}
                >
                  全データを削除
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.state.error}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            情報
          </Text>

          <View
            style={[
              styles.menuList,
              {
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary,
              },
            ]}
          >
            <Pressable style={[styles.menuItem]}>
              <View style={styles.menuContent}>
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={colors.text.secondary}
                />
                <Text style={[styles.menuText, { color: colors.text.primary }]}>
                  アプリについて
                </Text>
              </View>
              <View style={styles.menuRight}>
                <Text
                  style={[styles.menuValue, { color: colors.text.secondary }]}
                >
                  v1.0.0
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.text.secondary}
                />
              </View>
            </Pressable>
          </View>
        </View>

        <List.Section>
          <List.Subheader style={{ color: colors.text.secondary }}>
            買い物リスト設定
          </List.Subheader>
          <List.Item
            title="カテゴリ管理"
            description="カテゴリの追加・編集・並び替え"
            titleStyle={{ color: colors.text.primary }}
            descriptionStyle={{ color: colors.text.secondary }}
            left={(props) => (
              <List.Icon
                {...props}
                icon="tag-multiple"
                color={colors.text.secondary}
              />
            )}
            right={(props) => (
              <List.Icon
                {...props}
                icon="chevron-right"
                color={colors.text.secondary}
              />
            )}
            onPress={() => router.push('/settings/categories')}
            style={{ backgroundColor: colors.background.primary }}
          />
        </List.Section>
      </ScrollView>

      {/* テーマ設定モーダル */}
      {showThemeModal && (
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          ]}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background.primary },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              外観設定
            </Text>

            <View style={styles.themeOption}>
              <View style={styles.themeOptionContent}>
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={colors.text.secondary}
                />
                <Text
                  style={[
                    styles.themeOptionText,
                    { color: colors.text.primary },
                  ]}
                >
                  システム設定に従う
                </Text>
              </View>
              <Switch
                value={followSystem}
                onValueChange={(value) => setFollowSystem(value)}
                trackColor={{ false: '#767577', true: colors.accent.primary }}
                thumbColor="#f4f3f4"
              />
            </View>

            {!followSystem && (
              <Fragment>
                <View
                  style={[
                    styles.themeOption,
                    { opacity: followSystem ? 0.5 : 1 },
                  ]}
                >
                  <View style={styles.themeOptionContent}>
                    <Ionicons
                      name="sunny-outline"
                      size={24}
                      color={colors.text.secondary}
                    />
                    <Text
                      style={[
                        styles.themeOptionText,
                        { color: colors.text.primary },
                      ]}
                    >
                      ライトモード
                    </Text>
                  </View>
                  <Switch
                    value={!isDark}
                    onValueChange={(value) =>
                      setTheme(value ? 'light' : 'dark')
                    }
                    disabled={followSystem}
                    trackColor={{
                      false: '#767577',
                      true: colors.accent.primary,
                    }}
                    thumbColor="#f4f3f4"
                  />
                </View>

                <View
                  style={[
                    styles.themeOption,
                    { opacity: followSystem ? 0.5 : 1 },
                  ]}
                >
                  <View style={styles.themeOptionContent}>
                    <Ionicons
                      name="moon"
                      size={24}
                      color={colors.text.secondary}
                    />
                    <Text
                      style={[
                        styles.themeOptionText,
                        { color: colors.text.primary },
                      ]}
                    >
                      ダークモード
                    </Text>
                  </View>
                  <Switch
                    value={isDark}
                    onValueChange={(value) =>
                      setTheme(value ? 'dark' : 'light')
                    }
                    disabled={followSystem}
                    trackColor={{
                      false: '#767577',
                      true: colors.accent.primary,
                    }}
                    thumbColor="#f4f3f4"
                  />
                </View>
              </Fragment>
            )}

            <View style={styles.modalButtons}>
              <Pressable
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.accent.primary },
                ]}
                onPress={() => setShowThemeModal(false)}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: colors.text.inverse },
                  ]}
                >
                  閉じる
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  menuList: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 16,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuValue: {
    fontSize: 16,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    fontSize: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeOptionText: {
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalButtonText: {
    fontWeight: '600',
  },
});
