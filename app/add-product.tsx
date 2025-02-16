import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { useFrequentProductStore } from '../src/stores/useFrequentProductStore';
import { router } from 'expo-router';
import { ImagePicker } from '../src/components/ImagePicker';

export default function AddProductScreen() {
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    defaultQuantity: '',
    unit: '',
    imageUrl: null as string | null,
  });

  const { addProduct } = useFrequentProductStore();

  const handleSubmit = () => {
    if (!productData.name.trim()) {
      // TODO: エラー表示の実装
      return;
    }

    addProduct({
      name: productData.name.trim(),
      category: productData.category.trim(),
      defaultQuantity: productData.defaultQuantity
        ? Number(productData.defaultQuantity)
        : undefined,
      unit: productData.unit.trim(),
      imageUrl: productData.imageUrl,
    });

    router.back();
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
      imageUrl: null,
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <ImagePicker
          imageKey={productData.imageUrl}
          onImageSelected={handleImageSelected}
          onImageRemoved={handleImageRemoved}
          productId={Date.now().toString()}
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
            onChangeText={(text) =>
              setProductData({ ...productData, defaultQuantity: text })
            }
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
          <Text style={styles.submitButtonText}>追加</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});
