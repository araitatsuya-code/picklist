import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useFrequentProductStore } from '../../src/stores/useFrequentProductStore';
import { useCategoryStore } from '../../src/stores/useCategoryStore';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Menu } from 'react-native-paper';
import { FrequentProduct } from '../../src/types/frequentProduct';
import noImage from '../../assets/no-image.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeContext } from '../../src/components/ThemeProvider';

/**
 * よく買う商品リストを表示する画面
 */
export default function FrequentProductsScreen() {
  const { colors } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const { products, searchProducts } = useFrequentProductStore();
  const { categories } = useCategoryStore();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [imageUris, setImageUris] = useState<Record<string, string>>({});
  const [loadingErrors, setLoadingErrors] = useState<Record<string, boolean>>(
    {}
  );

  // カテゴリーを優先順位でソート
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.priority - b.priority);
  }, [categories]);

  // 検索とカテゴリーフィルターを組み合わせて商品をフィルタリング
  const filteredProducts = useMemo(() => {
    let filtered = searchQuery ? searchProducts(searchQuery) : products;

    if (selectedCategories.size > 0) {
      filtered = filtered.filter(
        (product) =>
          product.category && selectedCategories.has(product.category)
      );
    }

    return filtered;
  }, [products, searchQuery, selectedCategories, searchProducts]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedProducts(new Set());
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const handleProductPress = (product: FrequentProduct) => {
    if (isSelectionMode) {
      toggleProductSelection(product.id);
    } else {
      router.push(`/(products)/edit?id=${product.id}`);
    }
  };

  const handleAddToList = () => {
    if (selectedProducts.size === 0) return;
    const selectedIds = Array.from(selectedProducts).join(',');
    router.push(`/(products)/add-to-list?selectedIds=${selectedIds}`);
  };

  // 画像URIのロードを試みる
  const loadImageUri = useCallback(
    async (imageKey: string) => {
      try {
        // すでにエラーが発生した画像キーはスキップ
        if (loadingErrors[imageKey]) return;

        const uri = await AsyncStorage.getItem(imageKey);
        if (uri) {
          const finalUri = uri.startsWith('file://') ? uri : `file://${uri}`;
          setImageUris((prev) => ({ ...prev, [imageKey]: finalUri }));
        }
      } catch (error) {
        console.error('Failed to load image:', error);
        // エラーが発生した画像キーを記録
        setLoadingErrors((prev) => ({ ...prev, [imageKey]: true }));
      }
    },
    [loadingErrors]
  );

  // 無効な画像参照をクリーンアップ
  useEffect(() => {
    // すでに発生したエラーをローカルストレージに保存
    const saveErrorsToStorage = async () => {
      try {
        const errorKeys = Object.keys(loadingErrors);
        if (errorKeys.length > 0) {
          await AsyncStorage.setItem(
            'imageLoadingErrors',
            JSON.stringify(loadingErrors)
          );
        }
      } catch (error) {
        console.error('Failed to save image errors:', error);
      }
    };

    saveErrorsToStorage();
  }, [loadingErrors]);

  // 保存されていたエラーを読み込む
  useEffect(() => {
    const loadErrorsFromStorage = async () => {
      try {
        const errorsJson = await AsyncStorage.getItem('imageLoadingErrors');
        if (errorsJson) {
          const errors = JSON.parse(errorsJson);
          setLoadingErrors(errors);
        }
      } catch (error) {
        console.error('Failed to load image errors:', error);
      }
    };

    loadErrorsFromStorage();
  }, []);

  const renderProductImage = (
    imageKey: string | null | undefined,
    productName: string
  ) => {
    if (!imageKey || loadingErrors[imageKey]) {
      return (
        <View
          style={[
            styles.imagePlaceholder,
            { backgroundColor: colors.background.tertiary },
          ]}
        />
      );
    }

    if (!imageUris[imageKey]) {
      loadImageUri(imageKey);
      return (
        <View
          style={[
            styles.imagePlaceholder,
            { backgroundColor: colors.background.tertiary },
          ]}
        />
      );
    }

    const imageUri = imageUris[imageKey];

    return (
      <Image
        source={{ uri: imageUri }}
        style={styles.productImage}
        defaultSource={noImage}
        onError={() => {
          console.warn('Image loading error for product:', productName);

          // AsyncStorageから無効な参照を削除
          AsyncStorage.removeItem(imageKey).catch((err) =>
            console.error('Failed to remove invalid image key:', err)
          );

          setImageUris((prev) => {
            const next = { ...prev };
            delete next[imageKey];
            return next;
          });

          // エラーが発生した画像キーを記録
          setLoadingErrors((prev) => ({ ...prev, [imageKey]: true }));
        }}
        accessible={true}
        accessibilityLabel={`${productName}の画像`}
        resizeMode="cover"
      />
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <TextInput
            style={[
              styles.searchInput,
              {
                borderColor: colors.border.primary,
                backgroundColor: colors.background.primary,
                color: colors.text.primary,
              },
            ]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="商品を検索"
            placeholderTextColor={colors.text.tertiary}
          />

          <Pressable
            style={[
              styles.selectionButton,
              {
                borderColor: colors.accent.primary,
                backgroundColor: isSelectionMode
                  ? colors.accent.primary
                  : 'transparent',
              },
            ]}
            onPress={toggleSelectionMode}
          >
            <Ionicons
              name={isSelectionMode ? 'checkmark-circle' : 'cart-outline'}
              size={20}
              color={
                isSelectionMode ? colors.text.inverse : colors.accent.primary
              }
              style={styles.selectionButtonIcon}
            />
            <Text
              style={[
                styles.selectionButtonText,
                {
                  color: isSelectionMode
                    ? colors.text.inverse
                    : colors.accent.primary,
                },
              ]}
            >
              {isSelectionMode ? '選択中' : 'リストへ一括追加'}
            </Text>
          </Pressable>

          {categories.length > 0 && (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              contentStyle={{ backgroundColor: colors.background.primary }}
              anchor={
                <Pressable
                  style={[
                    styles.filterButton,
                    { borderColor: colors.border.primary },
                  ]}
                  onPress={() => setMenuVisible(true)}
                >
                  <Ionicons
                    name={
                      selectedCategories.size > 0 ? 'filter' : 'filter-outline'
                    }
                    size={24}
                    color={colors.accent.primary}
                  />
                  {selectedCategories.size > 0 && (
                    <View
                      style={[
                        styles.filterBadge,
                        { backgroundColor: colors.accent.primary },
                      ]}
                    >
                      <Text style={styles.filterBadgeText}>
                        {selectedCategories.size}
                      </Text>
                    </View>
                  )}
                </Pressable>
              }
            >
              {sortedCategories.map((category) => (
                <Menu.Item
                  key={category.id}
                  onPress={() => toggleCategory(category.id)}
                  title={category.name}
                  titleStyle={{ color: colors.text.primary }}
                  leadingIcon={
                    selectedCategories.has(category.id) ? 'check' : undefined
                  }
                />
              ))}
            </Menu>
          )}
        </View>

        <View style={styles.categoryArea}>
          {categories.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScrollContent}
              style={styles.categoryScroll}
            >
              {sortedCategories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: selectedCategories.has(category.id)
                        ? colors.accent.primary
                        : colors.background.tertiary,
                      borderColor: selectedCategories.has(category.id)
                        ? colors.accent.primary
                        : colors.border.primary,
                    },
                  ]}
                  onPress={() => toggleCategory(category.id)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      {
                        color: selectedCategories.has(category.id)
                          ? colors.text.inverse
                          : colors.text.secondary,
                      },
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}
        </View>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productList}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.productItem,
                {
                  borderBottomColor: colors.border.secondary,
                  backgroundColor: colors.background.primary,
                },
                isSelectionMode &&
                  selectedProducts.has(item.id) && {
                    backgroundColor: colors.accent.secondary,
                  },
              ]}
              onPress={() => handleProductPress(item)}
            >
              {isSelectionMode && (
                <View style={styles.checkbox}>
                  <Ionicons
                    name={
                      selectedProducts.has(item.id)
                        ? 'checkmark-circle'
                        : 'ellipse-outline'
                    }
                    size={24}
                    color={
                      selectedProducts.has(item.id)
                        ? colors.accent.primary
                        : colors.text.tertiary
                    }
                  />
                </View>
              )}
              {renderProductImage(item.imageUrl, item.name)}
              <View style={styles.productInfo}>
                <Text
                  style={[styles.productName, { color: colors.text.primary }]}
                >
                  {item.name}
                </Text>
                <View style={styles.productDetails}>
                  {item.category && (
                    <Text
                      style={[
                        styles.productCategory,
                        {
                          color: colors.text.secondary,
                          backgroundColor: colors.background.tertiary,
                        },
                      ]}
                    >
                      {categories.find((c) => c.id === item.category)?.name ||
                        ''}
                    </Text>
                  )}
                  <Text
                    style={[styles.addCount, { color: colors.text.secondary }]}
                  >
                    追加回数: {item.addCount || 0}回
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        />

        {isSelectionMode && selectedProducts.size > 0 && (
          <Pressable
            style={[
              styles.addToListButton,
              { backgroundColor: colors.accent.primary },
            ]}
            onPress={handleAddToList}
          >
            <Text
              style={[
                styles.addToListButtonText,
                { color: colors.text.inverse },
              ]}
            >
              {selectedProducts.size}個の商品をリストに追加
            </Text>
          </Pressable>
        )}

        {!isSelectionMode && (
          <Link href="/(products)/add" asChild>
            <Pressable
              style={[
                styles.fabButton,
                { backgroundColor: colors.accent.primary },
              ]}
            >
              <Ionicons name="add" size={24} color={colors.text.inverse} />
            </Pressable>
          </Link>
        )}
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryScroll: {
    maxHeight: 40,
    marginBottom: 0,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    height: 36,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
    maxWidth: 100,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 140,
    height: 40,
  },
  selectionButtonIcon: {
    marginRight: 4,
  },
  selectionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  productList: {
    paddingTop: 8,
  },
  productItem: {
    padding: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 12,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  productCategory: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  addCount: {
    fontSize: 14,
  },
  addToListButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  addToListButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  categorySpaceholder: {
    height: 40,
    marginBottom: 8,
  },
  categoryArea: {
    height: 40,
    marginBottom: 16,
  },
  fabButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 100,
  },
});
