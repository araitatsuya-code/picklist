import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useFrequentProductStore } from '../../src/stores/useFrequentProductStore';
import { useCategoryStore } from '../../src/stores/useCategoryStore';
import { router } from 'expo-router';
import { CustomImagePicker } from '../../src/components/ImagePicker';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
import { Menu } from 'react-native-paper';

export default function AddProductScreen() {
  const { addProduct } = useFrequentProductStore();
  const { categories, addCategory } = useCategoryStore();
  const [productData, setProductData] = useState<{
    name: string;
    category: string;
    defaultQuantity: string;
    unit: string;
    imageUrl: string | null;
  }>({
    name: '',
    category: '',
    defaultQuantity: '',
    unit: '',
    imageUrl: null,
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // カテゴリーを優先順位でソート
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.priority - b.priority);
  }, [categories]);

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

    addProduct({
      name: productData.name.trim(),
      category: categoryId || undefined,
      defaultQuantity: productData.defaultQuantity
        ? Number(productData.defaultQuantity)
        : undefined,
      unit: productData.unit.trim() || undefined,
      imageUrl: productData.imageUrl || undefined,
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
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.headerTitle}>商品を追加</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>商品名</Text>
            <TextInput
              style={styles.input}
              value={productData.name}
              onChangeText={(text) =>
                setProductData((prev) => ({ ...prev, name: text }))
              }
              placeholder="商品名を入力"
            />
          </View>

          <View style={styles.formGroup}>
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

          <View style={styles.formGroup}>
            <Text style={styles.label}>デフォルト数量</Text>
            <View style={styles.quantityContainer}>
              <TextInput
                style={[styles.input, styles.quantityInput]}
                value={productData.defaultQuantity}
                onChangeText={(text) =>
                  setProductData((prev) => ({
                    ...prev,
                    defaultQuantity: text.replace(/[^0-9]/g, ''),
                  }))
                }
                keyboardType="numeric"
                placeholder="1"
              />
              <TextInput
                style={[styles.input, styles.unitInput]}
                value={productData.unit}
                onChangeText={(text) =>
                  setProductData((prev) => ({ ...prev, unit: text }))
                }
                placeholder="個"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>商品画像</Text>
            <CustomImagePicker
              imageKey={productData.imageUrl}
              onImageSelected={handleImageSelected}
              onImageRemoved={handleImageRemoved}
              productId={Crypto.randomUUID()}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.submitButton,
            !productData.name && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!productData.name}
        >
          <Text style={styles.submitButtonText}>追加</Text>
        </Pressable>
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
  formGroup: {
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityInput: {
    flex: 1,
  },
  unitInput: {
    width: 80,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
