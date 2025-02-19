import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { FrequentProduct } from '../stores/useFrequentProductStore';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const noImage = require('../../assets/no-image.png');

type ProductListProps = {
  products: FrequentProduct[];
};

export function ProductList({ products }: ProductListProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const renderProductImage = (imageUrl: string | null | undefined) => {
    if (!imageUrl) {
      return <View style={styles.imagePlaceholder} />;
    }

    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.productImage}
        defaultSource={noImage}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="商品を検索"
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.productItem}
            onPress={() => {
              router.push(`/edit-product?id=${item.id}`);
            }}
          >
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
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
});
