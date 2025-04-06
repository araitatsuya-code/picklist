import React, { useState, useMemo, useCallback } from 'react';
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

/**
 * よく買う商品リストを表示する画面
 */
export default function FrequentProductsScreen() {
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

  const loadImageUri = useCallback(async (imageKey: string) => {
    try {
      const uri = await AsyncStorage.getItem(imageKey);
      if (uri) {
        const finalUri = uri.startsWith('file://') ? uri : `file://${uri}`;
        setImageUris((prev) => ({ ...prev, [imageKey]: finalUri }));
      }
    } catch (error) {
      console.error('Failed to load image:', error);
    }
  }, []);

  const renderProductImage = (
    imageKey: string | null | undefined,
    productName: string
  ) => {
    if (!imageKey) {
      return <View style={styles.imagePlaceholder} />;
    }

    if (!imageUris[imageKey]) {
      loadImageUri(imageKey);
      return <View style={styles.imagePlaceholder} />;
    }

    const imageUri = imageUris[imageKey];

    return (
      <Image
        source={{ uri: imageUri }}
        style={styles.productImage}
        defaultSource={noImage}
        onError={(e) => {
          console.warn(
            'Image loading error:',
            e.nativeEvent.error,
            'for URI:',
            imageUri
          );
          setImageUris((prev) => {
            const next = { ...prev };
            delete next[imageKey];
            return next;
          });
        }}
        accessible={true}
        accessibilityLabel={`${productName}の画像`}
        resizeMode="cover"
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="商品を検索"
          />

          <Pressable
            style={[
              styles.selectionButton,
              isSelectionMode && styles.selectionButtonActive,
            ]}
            onPress={toggleSelectionMode}
          >
            <Ionicons
              name={isSelectionMode ? 'checkmark-circle' : 'cart-outline'}
              size={20}
              color={isSelectionMode ? '#fff' : '#007AFF'}
              style={styles.selectionButtonIcon}
            />
            <Text
              style={[
                styles.selectionButtonText,
                isSelectionMode && styles.selectionButtonTextActive,
              ]}
            >
              {isSelectionMode ? '選択中' : 'リストへ一括追加'}
            </Text>
          </Pressable>

          {categories.length > 0 && (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Pressable
                  style={styles.filterButton}
                  onPress={() => setMenuVisible(true)}
                >
                  <Ionicons
                    name={
                      selectedCategories.size > 0 ? 'filter' : 'filter-outline'
                    }
                    size={24}
                    color="#007AFF"
                  />
                  {selectedCategories.size > 0 && (
                    <View style={styles.filterBadge}>
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
                    selectedCategories.has(category.id) &&
                      styles.categoryChipSelected,
                  ]}
                  onPress={() => toggleCategory(category.id)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategories.has(category.id) &&
                        styles.categoryChipTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}
        </View>

        {!isSelectionMode && (
          <Link href="/(products)/add" asChild>
            <Pressable style={styles.addButton}>
              <Text style={styles.addButtonText}>商品を追加</Text>
            </Pressable>
          </Link>
        )}

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productList}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.productItem,
                isSelectionMode &&
                  selectedProducts.has(item.id) &&
                  styles.productItemSelected,
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
                    color={selectedProducts.has(item.id) ? '#007AFF' : '#999'}
                  />
                </View>
              )}
              {renderProductImage(item.imageUrl, item.name)}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <View style={styles.productDetails}>
                  {item.category && (
                    <Text style={styles.productCategory}>
                      {categories.find((c) => c.id === item.category)?.name ||
                        ''}
                    </Text>
                  )}
                  <Text style={styles.addCount}>
                    追加回数: {item.addCount || 0}回
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        />

        {isSelectionMode && selectedProducts.size > 0 && (
          <Pressable style={styles.addToListButton} onPress={handleAddToList}>
            <Text style={styles.addToListButtonText}>
              {selectedProducts.size}個の商品をリストに追加
            </Text>
          </Pressable>
        )}
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
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#007AFF',
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
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#374151',
    maxWidth: 100,
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: 'transparent',
    minWidth: 140,
    height: 40,
  },
  selectionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selectionButtonIcon: {
    marginRight: 4,
  },
  selectionButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectionButtonTextActive: {
    color: '#fff',
  },
  productList: {
    paddingTop: 8,
  },
  productItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  productItemSelected: {
    backgroundColor: '#f0f9ff',
  },
  checkbox: {
    marginRight: 12,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
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
    color: '#666',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  addCount: {
    fontSize: 14,
    color: '#666',
  },
  addToListButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  addToListButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  categorySpaceholder: {
    height: 40,
    marginBottom: 8,
  },
  categoryArea: {
    height: 40,
    marginBottom: 16,
  },
});
