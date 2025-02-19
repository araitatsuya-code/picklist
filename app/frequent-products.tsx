import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useFrequentProductStore } from '../src/stores/useFrequentProductStore';
import { ProductList } from '../src/components/ProductList';
import { FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function FrequentProductsScreen() {
  const products = useFrequentProductStore((state) => state.products);

  return (
    <View style={styles.container}>
      <ProductList products={products} />
      <FAB
        icon={(props) => <Ionicons name="add" {...props} />}
        style={styles.fab}
        onPress={() => router.push('/add-product')}
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
