import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { List } from 'react-native-paper';
import { router } from 'expo-router';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>一般</Text>

        <View style={styles.menuList}>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuContent}>
              <Ionicons name="language-outline" size={24} color="#666" />
              <Text style={styles.menuText}>言語</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={styles.menuValue}>日本語</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuContent}>
              <Ionicons name="moon-outline" size={24} color="#666" />
              <Text style={styles.menuText}>ダークモード</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={styles.menuValue}>オフ</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>データ管理</Text>

        <View style={styles.menuList}>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuContent}>
              <Ionicons name="cloud-upload-outline" size={24} color="#666" />
              <Text style={styles.menuText}>データのエクスポート</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuContent}>
              <Ionicons name="cloud-download-outline" size={24} color="#666" />
              <Text style={styles.menuText}>データのインポート</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </Pressable>

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
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              <Text style={styles.dangerText}>全データを削除</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FF3B30" />
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>情報</Text>

        <View style={styles.menuList}>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuContent}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#666"
              />
              <Text style={styles.menuText}>アプリについて</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={styles.menuValue}>v1.0.0</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </Pressable>
        </View>
      </View>

      <List.Section>
        <List.Subheader>買い物リスト設定</List.Subheader>
        <List.Item
          title="カテゴリ管理"
          description="カテゴリの追加・編集・並び替え"
          left={(props) => <List.Icon {...props} icon="tag-multiple" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push('/settings/categories')}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    color: '#666',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  menuList: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuValue: {
    fontSize: 16,
    color: '#666',
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    fontSize: 16,
    color: '#FF3B30',
  },
});
