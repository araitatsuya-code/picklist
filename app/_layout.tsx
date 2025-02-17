import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useFrequentProductStore } from '../src/stores/useFrequentProductStore';
import * as imageUtils from '../src/utils/imageUtils';
import { PaperProvider } from 'react-native-paper';

export default function Layout() {
  const products = useFrequentProductStore((state) => state.products);

  // 画像の同期処理
  useEffect(() => {
    const imageKeys = products
      .map((product) => product.imageUrl)
      .filter((key): key is string => !!key);

    imageUtils.saveImageKeys(imageKeys);
    imageUtils.cleanupUnusedImages();
  }, [products]);

  return (
    <PaperProvider>
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
            name="list/[id]"
            options={{
              title: '買い物リストの詳細',
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
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
