import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>設定</Text>
      <Link href="/" style={styles.link}>
        ホームへ戻る
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    marginVertical: 10,
    fontSize: 16,
    color: '#007AFF',
  },
});
