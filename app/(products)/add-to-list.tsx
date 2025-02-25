import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useFrequentProductStore } from '../../src/stores/useFrequentProductStore';
import { usePicklistStore } from '../../src/stores/usePicklistStore';
import { Menu, Button } from 'react-native-paper';

export default function AddToListScreen() {
  const { selectedIds } = useLocalSearchParams<{ selectedIds: string }>();
  const selectedIdArray = useMemo(() => selectedIds.split(','), [selectedIds]);

  // 商品の取得
  const products = useFrequentProductStore((state) => state.products);
  const selectedProducts = useMemo(
    () => products.filter((p) => selectedIdArray.includes(p.id)),
    [products, selectedIdArray]
  );

  // 買い物リストの取得
  const picklists = usePicklistStore((state) => state.picklists);
  const addItemsToList = usePicklistStore((state) => state.addItemsToList);

  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [maxPrices, setMaxPrices] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleListSelectorPress = (event: GestureResponderEvent) => {
    const { pageY, pageX } = event.nativeEvent;
    setMenuAnchor({ x: pageX, y: pageY });
    setMenuVisible(true);
  };

  const handleSubmit = () => {
    if (!selectedList) return;

    const items = selectedProducts.map((product) => ({
      productId: product.id,
      name: product.name,
      quantity: Number(quantities[product.id] || product.defaultQuantity || 1),
      maxPrice: maxPrices[product.id]
        ? Number(maxPrices[product.id])
        : undefined,
      note: notes[product.id],
      completed: false,
    }));

    addItemsToList(selectedList, items);
    router.push(`/(lists)/${selectedList}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>買い物リストを選択</Text>
          <Button
            mode="outlined"
            onPress={handleListSelectorPress}
            style={styles.listSelector}
          >
            {selectedList
              ? picklists.find((l) => l.id === selectedList)?.name
              : '買い物リストを選択'}
          </Button>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={menuAnchor}
          >
            {picklists.map((list) => (
              <Menu.Item
                key={list.id}
                onPress={() => {
                  setSelectedList(list.id);
                  setMenuVisible(false);
                }}
                title={list.name}
              />
            ))}
          </Menu>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>商品の詳細を設定</Text>
          {selectedProducts.map((product) => (
            <View key={product.id} style={styles.productItem}>
              <Text style={styles.productName}>{product.name}</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>数量</Text>
                <TextInput
                  style={styles.input}
                  value={
                    quantities[product.id] ||
                    product.defaultQuantity?.toString() ||
                    '1'
                  }
                  onChangeText={(text) =>
                    setQuantities({ ...quantities, [product.id]: text })
                  }
                  keyboardType="numeric"
                  placeholder="数量"
                />
                <Text style={styles.unit}>{product.unit || '個'}</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>価格上限</Text>
                <TextInput
                  style={styles.input}
                  value={maxPrices[product.id]}
                  onChangeText={(text) =>
                    setMaxPrices({ ...maxPrices, [product.id]: text })
                  }
                  keyboardType="numeric"
                  placeholder="任意"
                />
                <Text style={styles.unit}>円</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>メモ</Text>
                <TextInput
                  style={[styles.input, styles.noteInput]}
                  value={notes[product.id]}
                  onChangeText={(text) =>
                    setNotes({ ...notes, [product.id]: text })
                  }
                  placeholder="メモを入力"
                  multiline
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.submitButton,
            !selectedList && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!selectedList}
        >
          <Text style={styles.submitButtonText}>追加</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  listSelector: {
    width: '100%',
    marginVertical: 8,
  },
  productItem: {
    marginBottom: 24,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    width: 80,
    fontSize: 14,
    color: '#666',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  noteInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  unit: {
    width: 30,
    fontSize: 14,
    color: '#666',
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
