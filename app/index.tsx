import { View, Text, Pressable, StyleSheet } from 'react-native';
import { usePicklistStore } from '../src/stores/usePicklistStore';
import { Link } from 'expo-router';

/**
 * 買い物リスト一覧を表示するホーム画面
 */
export default function HomeScreen() {
  const picklists = usePicklistStore((state) => state.picklists);
  const addPicklist = usePicklistStore((state) => state.addPicklist);

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>買い物リスト</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => addPicklist('新しいリスト')}
        >
          <Text style={styles.addButtonText}>＋ 新規作成</Text>
        </Pressable>
      </View>

      {/* リスト一覧 */}
      <View style={styles.listContainer}>
        {picklists.length === 0 ? (
          <Text style={styles.emptyText}>買い物リストを作成してください</Text>
        ) : (
          picklists.map((list) => (
            <Link key={list.id} href={`/list/${list.id}`} asChild>
              <Pressable style={styles.listItem}>
                <Text style={styles.listName}>{list.name}</Text>
                <Text style={styles.itemCount}>
                  {list.items.length}個のアイテム
                </Text>
              </Pressable>
            </Link>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 24,
  },
  listItem: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  listName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemCount: {
    color: '#6b7280',
  },
});
