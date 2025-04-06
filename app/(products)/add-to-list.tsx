import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  GestureResponderEvent,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useFrequentProductStore } from '../../src/stores/useFrequentProductStore';
import { usePicklistStore } from '../../src/stores/usePicklistStore';
import { Menu, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../src/components/ThemeProvider';

export default function AddToListScreen() {
  const { colors } = useThemeContext();
  const { selectedIds } = useLocalSearchParams<{ selectedIds: string }>();
  const selectedIdArray = useMemo(() => {
    if (!selectedIds) return [];
    return selectedIds.split(',');
  }, [selectedIds]);

  // 商品の取得
  const products = useFrequentProductStore((state) => state.products);
  const incrementAddCount = useFrequentProductStore(
    (state) => state.incrementAddCount
  );
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

    const items = selectedProducts.map((product) => {
      // 追加回数をインクリメント
      incrementAddCount(product.id);

      return {
        productId: product.id,
        name: product.name,
        quantity: Number(
          quantities[product.id] || product.defaultQuantity || 1
        ),
        maxPrice: maxPrices[product.id]
          ? Number(maxPrices[product.id])
          : undefined,
        note: notes[product.id],
        category: product.category,
        completed: false,
      };
    });

    addItemsToList(
      selectedList,
      items.map((item) => ({
        ...item,
        priority: 2, // デフォルトで中優先度を設定
      }))
    );
    router.push(`/(tabs)/list/${selectedList}`);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
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
          リストに追加
        </Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView style={styles.content}>
        <View
          style={[
            styles.section,
            { borderBottomColor: colors.border.secondary },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            買い物リストを選択
          </Text>
          <Button
            mode="outlined"
            onPress={handleListSelectorPress}
            style={styles.listSelector}
            textColor={colors.text.primary}
            buttonColor={colors.background.primary}
            theme={{ colors: { outline: colors.border.primary } }}
          >
            {selectedList
              ? picklists.find((l) => l.id === selectedList)?.name
              : '買い物リストを選択'}
          </Button>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={menuAnchor}
            contentStyle={{ backgroundColor: colors.background.primary }}
          >
            {picklists.map((list) => (
              <Menu.Item
                key={list.id}
                onPress={() => {
                  setSelectedList(list.id);
                  setMenuVisible(false);
                }}
                title={list.name}
                titleStyle={{ color: colors.text.primary }}
              />
            ))}
          </Menu>
        </View>

        <View
          style={[
            styles.section,
            { borderBottomColor: colors.border.secondary },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            商品の詳細を設定
          </Text>
          {selectedProducts.map((product) => (
            <View key={product.id} style={styles.productItem}>
              <Text
                style={[styles.productName, { color: colors.text.primary }]}
              >
                {product.name}
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.secondary }]}>
                  数量
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border.primary,
                      backgroundColor: colors.background.primary,
                      color: colors.text.primary,
                    },
                  ]}
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
                  placeholderTextColor={colors.text.tertiary}
                />
                <Text style={[styles.unit, { color: colors.text.secondary }]}>
                  {product.unit || '個'}
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.secondary }]}>
                  価格上限
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border.primary,
                      backgroundColor: colors.background.primary,
                      color: colors.text.primary,
                    },
                  ]}
                  value={maxPrices[product.id]}
                  onChangeText={(text) =>
                    setMaxPrices({ ...maxPrices, [product.id]: text })
                  }
                  keyboardType="numeric"
                  placeholder="任意"
                  placeholderTextColor={colors.text.tertiary}
                />
                <Text style={[styles.unit, { color: colors.text.secondary }]}>
                  円
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.secondary }]}>
                  メモ
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.noteInput,
                    {
                      borderColor: colors.border.primary,
                      backgroundColor: colors.background.primary,
                      color: colors.text.primary,
                    },
                  ]}
                  value={notes[product.id]}
                  onChangeText={(text) =>
                    setNotes({ ...notes, [product.id]: text })
                  }
                  placeholder="メモを入力"
                  placeholderTextColor={colors.text.tertiary}
                  multiline
                />
              </View>
            </View>
          ))}
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
            !selectedList && { backgroundColor: colors.text.tertiary },
          ]}
          onPress={handleSubmit}
          disabled={!selectedList}
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
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
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
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
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
