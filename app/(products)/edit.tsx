import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useFrequentProductStore } from '../../src/stores/useFrequentProductStore';
import { router, useLocalSearchParams } from 'expo-router';
import { CustomImagePicker } from '../../src/components/ImagePicker';
import { Ionicons } from '@expo/vector-icons';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, updateProduct, deleteProduct } = useFrequentProductStore();
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    imageUrl: '',
    defaultQuantity: '',
    unit: '',
  });

  const product = useMemo(
    () => products.find((p) => p.id === id),
    [products, id]
  );

  useEffect(() => {
    if (!product) {
      router.back();
      return;
    }

    setProductData({
      name: product.name,
      category: product.category || '',
      imageUrl: product.imageUrl || '',
      defaultQuantity: product.defaultQuantity?.toString() || '',
      unit: product.unit || '',
    });
  }, [
    product,
    product?.name,
    product?.category,
    product?.imageUrl,
    product?.defaultQuantity,
    product?.unit,
  ]);

  const handleSubmit = () => {
    if (!productData.name.trim()) {
      // TODO: エラー表示の実装
      return;
    }

    updateProduct(id, {
      name: productData.name.trim(),
      category: productData.category.trim(),
      defaultQuantity: productData.defaultQuantity
        ? Number(productData.defaultQuantity)
        : undefined,
      unit: productData.unit.trim(),
      imageUrl: productData.imageUrl || undefined,
      updatedAt: Date.now(),
    });

    router.back();
  };

  const handleDelete = () => {
    Alert.alert('商品の削除', '本当にこの商品を削除しますか？', [
      {
        text: 'キャンセル',
        style: 'cancel',
      },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          deleteProduct(id);
          router.back();
        },
      },
    ]);
  };

  const handleImageSelected = (key: string) => {
    setProductData((prev) => ({
      ...prev,
      imageUrl: key,
    }));
  };

  const handleImageRemoved = () => {
    setProductData((prev) => ({
      ...prev,
      imageUrl: '',
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </Pressable>
        <Text style={styles.headerTitle}>商品を編集</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <CustomImagePicker
            imageKey={productData.imageUrl}
            onImageSelected={handleImageSelected}
            onImageRemoved={handleImageRemoved}
            productId={id}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>商品名 *</Text>
            <TextInput
              style={styles.input}
              value={productData.name}
              onChangeText={(text) =>
                setProductData({ ...productData, name: text })
              }
              placeholder="商品名を入力"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>カテゴリー</Text>
            <TextInput
              style={styles.input}
              value={productData.category}
              onChangeText={(text) =>
                setProductData({ ...productData, category: text })
              }
              placeholder="カテゴリーを入力"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>デフォルト数量</Text>
            <TextInput
              style={styles.input}
              value={productData.defaultQuantity}
              onChangeText={(text) => {
                // 数値のみ許可（空文字または数字）
                if (text === '' || /^\d+$/.test(text)) {
                  setProductData({ ...productData, defaultQuantity: text });
                }
              }}
              placeholder="数量を入力"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>単位</Text>
            <TextInput
              style={styles.input}
              value={productData.unit}
              onChangeText={(text) =>
                setProductData({ ...productData, unit: text })
              }
              placeholder="個、本、パックなど"
            />
          </View>

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>更新</Text>
          </Pressable>

          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>削除</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerRight: {
    width: 40,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
});
