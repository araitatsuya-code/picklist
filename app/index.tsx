import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Picklist</Text>
      <Link href="/scanner" style={styles.link}>
        スキャナーへ
      </Link>
      <Link href="/settings" style={styles.link}>
        設定へ
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
