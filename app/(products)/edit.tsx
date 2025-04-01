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
import { useCategoryStore } from '../../src/stores/useCategoryStore';
import { router, useLocalSearchParams } from 'expo-router';
import { CustomImagePicker } from '../../src/components/ImagePicker';
import { Ionicons } from '@expo/vector-icons';
import { Menu } from 'react-native-paper';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, updateProduct, deleteProduct } = useFrequentProductStore();
  const { categories, addCategory } = useCategoryStore();
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    imageUrl: '',
    defaultQuantity: '',
    unit: '',
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // カテゴリーを優先順位でソート
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.priority - b.priority);
  }, [categories]);

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

    // 新しいカテゴリーを作成
    let categoryId = productData.category;
    if (isNewCategory && newCategoryName.trim()) {
      const now = Date.now();
      addCategory({
        name: newCategoryName,
        displayOrder: categories.length + 1,
        priority: categories.length + 1,
      });
      categoryId = now.toString();
    }

    updateProduct(id, {
      name: productData.name.trim(),
      category: categoryId || undefined,
      defaultQuantity: productData.defaultQuantity
        ? Number(productData.defaultQuantity)
        : undefined,
      unit: productData.unit.trim() || undefined,
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

  const handleCategorySelect = (categoryId: string) => {
    setProductData((prev) => ({
      ...prev,
      category: categoryId,
    }));
    setIsNewCategory(false);
    setMenuVisible(false);
  };

  const handleNewCategoryPress = () => {
    setIsNewCategory(true);
    setMenuVisible(false);
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
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Pressable
                  style={styles.categoryButton}
                  onPress={() => setMenuVisible(true)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      !productData.category &&
                        !isNewCategory &&
                        styles.categoryButtonPlaceholder,
                    ]}
                  >
                    {isNewCategory
                      ? newCategoryName || 'カテゴリー名を入力'
                      : categories.find((c) => c.id === productData.category)
                          ?.name || 'カテゴリーを選択'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </Pressable>
              }
            >
              {sortedCategories.map((category) => (
                <Menu.Item
                  key={category.id}
                  onPress={() => handleCategorySelect(category.id)}
                  title={category.name}
                  leadingIcon={
                    productData.category === category.id ? 'check' : undefined
                  }
                />
              ))}
              <Menu.Item
                onPress={handleNewCategoryPress}
                title="新しいカテゴリーを作成"
                leadingIcon="plus"
              />
            </Menu>
            {isNewCategory && (
              <TextInput
                style={[styles.input, styles.newCategoryInput]}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="新しいカテゴリー名を入力"
              />
            )}
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
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  categoryButton: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#000',
  },
  categoryButtonPlaceholder: {
    color: '#999',
  },
  newCategoryInput: {
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
