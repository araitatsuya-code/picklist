import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { usePicklistStore } from '../../src/stores/usePicklistStore';
import { Link } from 'expo-router';

export default function PicklistScreen() {
  const picklists = usePicklistStore((state) => state.picklists);
  const { addPicklist, removePicklist } = usePicklistStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* リスト一覧 */}
        <View style={styles.listContainer}>
          <Pressable
            style={styles.addButton}
            onPress={() => addPicklist('新しいリスト')}
          >
            <Text style={styles.addButtonText}>＋ 新規作成</Text>
          </Pressable>
          {picklists.length === 0 ? (
            <Text style={styles.emptyText}>買い物リストを作成してください</Text>
          ) : (
            picklists.map((list) => (
              <View key={list.id} style={styles.listItem}>
                <Link href={`/list/${list.id}`} asChild>
                  <Pressable style={styles.listContent}>
                    <Text style={styles.listName}>{list.name}</Text>
                    <Text style={styles.itemCount}>
                      {list.items.length}個のアイテム
                    </Text>
                  </Pressable>
                </Link>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => removePicklist(list.id)}
                >
                  <Text style={styles.deleteButtonText}>削除</Text>
                </Pressable>
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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
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
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 12,
  },
  listContent: {
    flex: 1,
    padding: 16,
  },
  listName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemCount: {
    color: '#6b7280',
  },
  deleteButton: {
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
