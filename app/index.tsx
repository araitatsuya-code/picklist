import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import { useFrequentProductStore } from '../src/stores/useFrequentProductStore';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Menu } from 'react-native-paper';
import { FrequentProduct } from '../src/types/frequentProduct';
import noImage from '../assets/no-image.png';

/**
 * 買い物リスト一覧を表示するホーム画面
 */
export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const { products, searchProducts } = useFrequentProductStore();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );

  // 全カテゴリーのリストを取得
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    products.forEach((product) => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });
    return Array.from(categorySet).sort();
  }, [products]);

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

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
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
      router.push(`/edit-product?id=${product.id}`);
    }
  };

  const handleAddToList = () => {
    if (selectedProducts.size === 0) return;
    const selectedIds = Array.from(selectedProducts).join(',');
    router.push(`/add-to-list?selectedIds=${selectedIds}`);
  };

  const renderProductImage = (imageKey: string | null | undefined) => {
    if (!imageKey) {
      return <View style={styles.imagePlaceholder} />;
    }

    return (
      <Image
        source={{ uri: imageKey }}
        style={styles.productImage}
        defaultSource={noImage}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="商品を検索"
        />

        <Pressable style={styles.modeButton} onPress={toggleSelectionMode}>
          <Ionicons
            name={isSelectionMode ? 'checkmark-circle' : 'add-circle-outline'}
            size={24}
            color="#007AFF"
          />
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
            {categories.map((category) => (
              <Menu.Item
                key={category}
                onPress={() => toggleCategory(category)}
                title={category}
                leadingIcon={
                  selectedCategories.has(category) ? 'check' : undefined
                }
              />
            ))}
          </Menu>
        )}
      </View>

      {categories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.categoryChip,
                selectedCategories.has(category) && styles.categoryChipSelected,
              ]}
              onPress={() => toggleCategory(category)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategories.has(category) &&
                    styles.categoryChipTextSelected,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View style={styles.listContainer}>
        {isSelectionMode ? (
          <View style={styles.selectionHeader}>
            <Text style={styles.selectionCount}>
              {selectedProducts.size}個選択中
            </Text>
            <Pressable
              style={[
                styles.addToListButton,
                selectedProducts.size === 0 && styles.addToListButtonDisabled,
              ]}
              onPress={handleAddToList}
              disabled={selectedProducts.size === 0}
            >
              <Text style={styles.addToListButtonText}>買い物リストに追加</Text>
            </Pressable>
          </View>
        ) : (
          <Link href="/add-product" asChild>
            <Pressable style={styles.addButton}>
              <Text style={styles.addButtonText}>商品を追加</Text>
            </Pressable>
          </Link>
        )}

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.productItem,
                selectedProducts.has(item.id) && styles.productItemSelected,
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
              {renderProductImage(item.imageUrl)}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                {item.category && (
                  <Text style={styles.productCategory}>{item.category}</Text>
                )}
              </View>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  productItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
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
    marginBottom: 8,
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
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  modeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectionCount: {
    fontSize: 16,
    color: '#666',
  },
  addToListButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addToListButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addToListButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  productItemSelected: {
    backgroundColor: '#f0f9ff',
  },
  checkbox: {
    marginRight: 12,
  },
});
