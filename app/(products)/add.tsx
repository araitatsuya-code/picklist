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
import { useThemeContext } from '../../src/components/ThemeProvider';
import { ErrorDisplay } from '../../src/components/ErrorDisplay';

export default function AddProductScreen() {
  const { colors } = useThemeContext();
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
  const [errorMessage, setErrorMessage] = useState('');

  // カテゴリーを優先順位でソート
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.priority - b.priority);
  }, [categories]);

  const handleSubmit = () => {
    if (!productData.name.trim()) {
      setErrorMessage('商品名を入力してください');
      return;
    }

    // エラーメッセージをクリア
    setErrorMessage('');

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
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ScrollView style={styles.content}>
        <View
          style={[
            styles.header,
            {
              borderBottomColor: colors.border.secondary,
              backgroundColor: colors.background.primary,
            },
          ]}
        >
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.accent.primary}
            />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            商品を追加
          </Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              商品名
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errorMessage ? colors.state.error : colors.border.primary,
                  backgroundColor: colors.background.primary,
                  color: colors.text.primary,
                },
              ]}
              value={productData.name}
              onChangeText={(text) => {
                setProductData((prev) => ({ ...prev, name: text }));
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="商品名を入力"
              placeholderTextColor={colors.text.tertiary}
            />
            <ErrorDisplay message={errorMessage} visible={!!errorMessage} />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              カテゴリー
            </Text>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              contentStyle={{ backgroundColor: colors.background.primary }}
              anchor={
                <Pressable
                  style={[
                    styles.categoryButton,
                    {
                      borderColor: colors.border.primary,
                      backgroundColor: colors.background.primary,
                    },
                  ]}
                  onPress={() => setMenuVisible(true)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      { color: colors.text.primary },
                      !productData.category &&
                        !isNewCategory && { color: colors.text.tertiary },
                    ]}
                  >
                    {isNewCategory
                      ? newCategoryName || 'カテゴリー名を入力'
                      : categories.find((c) => c.id === productData.category)
                          ?.name || 'カテゴリーを選択'}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={colors.text.secondary}
                  />
                </Pressable>
              }
            >
              {sortedCategories.map((category) => (
                <Menu.Item
                  key={category.id}
                  onPress={() => handleCategorySelect(category.id)}
                  title={category.name}
                  titleStyle={{ color: colors.text.primary }}
                  leadingIcon={
                    productData.category === category.id ? 'check' : undefined
                  }
                />
              ))}
              <Menu.Item
                onPress={handleNewCategoryPress}
                title="新しいカテゴリーを作成"
                titleStyle={{ color: colors.text.primary }}
                leadingIcon="plus"
              />
            </Menu>
            {isNewCategory && (
              <TextInput
                style={[
                  styles.input,
                  styles.newCategoryInput,
                  {
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                  },
                ]}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="新しいカテゴリー名を入力"
                placeholderTextColor={colors.text.tertiary}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              デフォルト数量
            </Text>
            <View style={styles.quantityContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.quantityInput,
                  {
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                  },
                ]}
                value={productData.defaultQuantity}
                onChangeText={(text) =>
                  setProductData((prev) => ({
                    ...prev,
                    defaultQuantity: text.replace(/[^0-9]/g, ''),
                  }))
                }
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor={colors.text.tertiary}
              />
              <TextInput
                style={[
                  styles.input,
                  styles.unitInput,
                  {
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                  },
                ]}
                value={productData.unit}
                onChangeText={(text) =>
                  setProductData((prev) => ({ ...prev, unit: text }))
                }
                placeholder="個"
                placeholderTextColor={colors.text.tertiary}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              商品画像
            </Text>
            <CustomImagePicker
              imageKey={productData.imageUrl}
              onImageSelected={handleImageSelected}
              onImageRemoved={handleImageRemoved}
              productId={Crypto.randomUUID()}
            />
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.border.secondary,
            backgroundColor: colors.background.primary,
          },
        ]}
      >
        <Pressable
          style={[
            styles.submitButton,
            { backgroundColor: colors.accent.primary },
            !productData.name && { backgroundColor: colors.text.tertiary },
          ]}
          onPress={handleSubmit}
          disabled={!productData.name}
        >
          <Text
            style={[styles.submitButtonText, { color: colors.text.inverse }]}
          >
            追加
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  categoryButton: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryButtonText: {
    fontSize: 16,
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
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
