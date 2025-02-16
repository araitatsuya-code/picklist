import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { useFrequentProductStore } from '../src/stores/useFrequentProductStore';
import { Link, router } from 'expo-router';
import * as imageUtils from '../src/utils/imageUtils';

export default function FrequentProductsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { products, searchProducts, deleteProduct } = useFrequentProductStore();

  const filteredProducts = searchQuery ? searchProducts(searchQuery) : products;

  const renderProductImage = (imageKey: string | null | undefined) => {
    if (!imageKey) {
      return <View style={styles.imagePlaceholder} />;
    }

    return (
      <Image
        source={{ uri: imageKey }}
        style={styles.productImage}
        defaultSource={require('../assets/placeholder.png')}
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

      <Link href="/add-product" asChild>
        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>商品を追加</Text>
        </Pressable>
      </Link>

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
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
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
});
