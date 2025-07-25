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
  Alert,
} from 'react-native';
import { useFrequentProductStore } from '../../src/stores/useFrequentProductStore';
import { useCategoryStore } from '../../src/stores/useCategoryStore';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Menu } from 'react-native-paper';
import { FrequentProduct } from '../../src/types/frequentProduct';
import noImage from '../../assets/no-image.png';
import * as imageUtils from '../../src/utils/imageUtils';
import { useTheme } from '../../src/hooks/useTheme';

// Types
type Category = {
  id: string;
  name: string;
  priority: number;
};

type Colors = {
  accent: {
    primary: string;
    secondary: string;
  };
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  border: {
    primary: string;
    secondary: string;
  };
};

// Component Props
interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: Set<string>;
  toggleCategory: (categoryId: string) => void;
  colors: Colors;
}

interface ProductItemProps {
  item: FrequentProduct;
  isSelectionMode: boolean;
  selectedProducts: Set<string>;
  handleProductPress: (product: FrequentProduct) => void;
  renderProductImage: (
    imageKey: string | null | undefined,
    productName: string,
    productId: string
  ) => React.ReactNode;
  categories: Category[];
  colors: Colors;
}

interface AddToListButtonProps {
  selectedProducts: Set<string>;
  handleAddToList: () => void;
  colors: Colors;
}

// Components
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  toggleCategory,
  colors,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryScrollContent}
      style={styles.categoryScroll}
    >
      {categories.map((category) => (
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
  );
};

const ProductItem: React.FC<ProductItemProps> = ({
  item,
  isSelectionMode,
  selectedProducts,
  handleProductPress,
  renderProductImage,
  categories,
  colors,
}) => {
  return (
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
      {renderProductImage(item.imageUrl, item.name, item.id)}
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text.primary }]}>
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
              {categories.find((c) => c.id === item.category)?.name || ''}
            </Text>
          )}
          <Text style={[styles.addCount, { color: colors.text.secondary }]}>
            追加回数: {item.addCount || 0}回
          </Text>
        </View>
      </View>
      <Pressable
        style={[
          styles.editButton,
          { backgroundColor: colors.background.tertiary, borderRadius: 16 },
        ]}
        onPress={() => router.push(`/(products)/edit?id=${item.id}`)}
        accessibilityLabel="編集"
      >
        <Ionicons
          name="create-outline"
          size={22}
          color={colors.accent.primary}
        />
      </Pressable>
    </Pressable>
  );
};

const AddToListButton: React.FC<AddToListButtonProps> = ({
  selectedProducts,
  handleAddToList,
  colors,
}) => {
  return (
    <Pressable
      style={[
        styles.addToListButton,
        {
          backgroundColor: colors.accent.primary,
        },
      ]}
      onPress={handleAddToList}
    >
      <Text
        style={[styles.addToListButtonText, { color: colors.text.inverse }]}
      >
        {selectedProducts.size}個の商品をリストに追加
      </Text>
    </Pressable>
  );
};

/**
 * よく買う商品リストを表示する画面
 */
export default function FrequentProductsScreen() {
  const { colors } = useTheme();
  // const systemColorScheme = useColorScheme(); // ←未使用なので削除
  // const { theme, followSystem } = useThemeStore(); // ←未使用なので削除

  // State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [sortMenuVisible, setSortMenuVisible] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'default' | 'addCount'>('default');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [imageUris, setImageUris] = useState<Record<string, string>>({});
  const [errorProducts, setErrorProducts] = useState<Set<string>>(new Set());

  // Store hooks
  const { products, searchProducts, updateProduct } = useFrequentProductStore();
  const { categories } = useCategoryStore();

  // Local search params
  const params = useLocalSearchParams();
  const selectForList = params.selectForList as string | undefined;

  // カテゴリーを優先順位でソート
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.priority - b.priority);
  }, [categories]);

  // 検索とカテゴリーフィルターを組み合わせて商品をフィルタリング・並び替え
  const filteredProducts = useMemo(() => {
    let filtered = searchQuery ? searchProducts(searchQuery) : products;

    if (selectedCategories.size > 0) {
      filtered = filtered.filter(
        (product) =>
          product.category && selectedCategories.has(product.category)
      );
    }

    // 並び替え
    if (sortBy === 'addCount') {
      filtered = filtered.sort((a, b) => (b.addCount || 0) - (a.addCount || 0));
    } else {
      // デフォルト（作成順）
      filtered = filtered.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    }

    return filtered;
  }, [products, searchQuery, selectedCategories, searchProducts, sortBy]);

  // Event handlers
  const toggleCategory = useCallback((categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const toggleProductSelection = useCallback((productId: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);

  const handleProductPress = useCallback(
    (product: FrequentProduct) => {
      toggleProductSelection(product.id);
    },
    [toggleProductSelection]
  );

  const handleAddToList = useCallback(() => {
    if (selectedProducts.size === 0) return;
    const selectedIds = encodeURIComponent(
      Array.from(selectedProducts).join(',')
    );
    let url = `/(products)/add-to-list?selectedIds=${selectedIds}`;
    if (selectForList) {
      url += `&listId=${selectForList}`;
    }
    router.push(url);
  }, [selectedProducts, selectForList]);

  // Image handling
  const loadImageUri = useCallback(
    async (imageKey: string) => {
      try {
        // すでにエラーが発生した画像キーはスキップ
        if (errorProducts.has(imageKey)) return;

        const uri = await imageUtils.loadImage(imageKey);
        if (uri) {
          setImageUris((prev) => ({ ...prev, [imageKey]: uri }));
        }
      } catch (error) {
        console.error('Failed to load image:', error);
        setErrorProducts((prev) => new Set(prev).add(imageKey));
      }
    },
    [errorProducts]
  );

  const handleImageError = useCallback(
    (imageKey: string, productName: string, productId: string) => {
      // エラーが発生したことを記録
      setErrorProducts((prev) => new Set(prev).add(imageKey));

      // 画像URIをクリア
      setImageUris((prev) => {
        const next = { ...prev };
        delete next[imageKey];
        return next;
      });

      // 商品データと画像情報を自動的にクリア
      const product = products.find((p) => p.id === productId);
      if (product?.imageUrl) {
        imageUtils
          .deleteImage(product.imageUrl)
          .catch((err) =>
            console.error('Failed to remove invalid image:', err)
          );

        // 商品データを更新
        updateProduct(productId, {
          ...product,
          imageUrl: undefined,
        });

        // 通知メッセージを表示
        Alert.alert(
          '画像情報をクリアしました',
          `「${productName}」の画像が見つからなかったため、画像情報をクリアしました。`,
          [{ text: 'OK' }]
        );
      }
    },
    [products, updateProduct]
  );

  const renderProductImage = useCallback(
    (
      imageKey: string | null | undefined,
      productName: string,
      productId: string
    ) => {
      // 画像キーがない、エラーがある、またはURIがない場合はプレースホルダーを表示
      if (!imageKey || errorProducts.has(imageKey) || !imageUris[imageKey]) {
        return (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: colors.background.tertiary },
            ]}
          />
        );
      }

      return (
        <Image
          source={{ uri: imageUris[imageKey] }}
          style={styles.productImage}
          defaultSource={noImage}
          onError={() => handleImageError(imageKey, productName, productId)}
          accessible={true}
          accessibilityLabel={`${productName}の画像`}
          resizeMode="cover"
        />
      );
    },
    [colors, errorProducts, imageUris, handleImageError]
  );

  // 画像の読み込みを管理するuseEffect
  useEffect(() => {
    const loadImages = async () => {
      const imageKeys = filteredProducts
        .map((product) => product.imageUrl)
        .filter(
          (key): key is string =>
            !!key && !imageUris[key] && !errorProducts.has(key)
        );

      for (const key of imageKeys) {
        await loadImageUri(key);
      }
    };

    loadImages();
  }, [filteredProducts, imageUris, errorProducts, loadImageUri]);

  useFocusEffect(
    React.useCallback(() => {
      if (selectForList) {
        setSelectedProducts(new Set());
      }
    }, [selectForList])
  );

  const isSelectionMode = true;

  return (
    <>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <View style={styles.content}>
          {/* Header section with search and filters */}
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

            {/* Category filter menu */}
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
                        selectedCategories.size > 0
                          ? 'filter'
                          : 'filter-outline'
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

            {/* Sort menu */}
            <Menu
              visible={sortMenuVisible}
              onDismiss={() => setSortMenuVisible(false)}
              contentStyle={{ backgroundColor: colors.background.primary }}
              anchor={
                <Pressable
                  style={[
                    styles.sortButton,
                    { borderColor: colors.border.primary },
                  ]}
                  onPress={() => setSortMenuVisible(true)}
                >
                  <Ionicons
                    name="swap-vertical"
                    size={24}
                    color={colors.accent.primary}
                  />
                </Pressable>
              }
            >
              <Menu.Item
                onPress={() => {
                  setSortBy('default');
                  setSortMenuVisible(false);
                }}
                title="作成順"
                titleStyle={{ color: colors.text.primary }}
                leadingIcon={sortBy === 'default' ? 'check' : undefined}
              />
              <Menu.Item
                onPress={() => {
                  setSortBy('addCount');
                  setSortMenuVisible(false);
                }}
                title="追加回数順"
                titleStyle={{ color: colors.text.primary }}
                leadingIcon={sortBy === 'addCount' ? 'check' : undefined}
              />
            </Menu>
          </View>

          {/* Category chips */}
          <View style={styles.categoryArea}>
            {categories.length > 0 && (
              <CategoryFilter
                categories={sortedCategories}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                colors={colors}
              />
            )}
          </View>

          {/* Product list */}
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.productList}
            renderItem={({ item }) => (
              <ProductItem
                item={item}
                isSelectionMode={isSelectionMode}
                selectedProducts={selectedProducts}
                handleProductPress={handleProductPress}
                renderProductImage={renderProductImage}
                categories={categories}
                colors={colors}
              />
            )}
          />

          {/* Add to list button when in selection mode */}
          {isSelectionMode && selectedProducts.size > 0 && (
            <AddToListButton
              selectedProducts={selectedProducts}
              handleAddToList={handleAddToList}
              colors={colors}
            />
          )}
        </View>
        {/* フッター */}
        <View
          style={[
            styles.footerBar,
            {
              borderColor: colors.border.secondary,
              backgroundColor: colors.background.primary,
            },
          ]}
        >
          <Pressable
            style={[
              styles.footerAddButton,
              {
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
              },
            ]}
            onPress={() => router.push('/(products)/add')}
          >
            <Ionicons name="add" size={22} color={colors.accent.primary} />
          </Pressable>
          <Text
            style={[styles.footerDescription, { color: colors.text.tertiary }]}
          >
            よく買う商品を追加する
          </Text>
        </View>
      </SafeAreaView>
    </>
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
  sortButton: {
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
    marginBottom: 8,
  },
  fabWrapper: {
    position: 'absolute',
    right: 20,
    bottom: 16,
    width: 72,
    height: 72,
  },
  fabButton: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIconWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 36,
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
  },
  footerAddButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  footerDescription: {
    fontSize: 15,
    color: '#aaa',
  },
  editButton: {
    padding: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
