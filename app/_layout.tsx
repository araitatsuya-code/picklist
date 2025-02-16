import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function Layout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'よく買う商品',
          }}
        />
        <Stack.Screen
          name="add-product"
          options={{
            title: '商品を追加',
          }}
        />
        <Stack.Screen
          name="edit-product"
          options={{
            title: '商品を編集',
          }}
        />
        <Stack.Screen
          name="lists/index"
          options={{
            title: '買い物リスト',
          }}
        />
        <Stack.Screen
          name="scanner"
          options={{
            title: 'バーコードスキャナー',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: '設定',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
