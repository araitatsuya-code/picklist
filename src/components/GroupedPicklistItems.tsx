import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal } from 'react-native';
import { usePicklistStore } from '../stores/usePicklistStore';
import { useCategoryStore, Category } from '../stores/useCategoryStore';
import {
  sortByCategory,
  sortByPriority,
  sortByName,
  groupAndSortByCategory,
  sortByCreated,
} from '../utils/sortUtils';
import { PicklistItem } from '../stores/usePicklistStore';
import { Ionicons } from '@expo/vector-icons';
import * as imageUtils from '../utils/imageUtils';
import { useFrequentProductStore } from '../stores/useFrequentProductStore';
import { useTheme } from '../hooks/useTheme';

interface GroupedPicklistItemsProps {
  listId: string;
  onItemPress?: (item: PicklistItem) => void;
  onItemDelete?: (item: PicklistItem) => void;
  onNotePress?: (item: PicklistItem) => void;
}

type ItemGroup = {
  category?: Category;
  items: PicklistItem[];
};

export const GroupedPicklistItems: React.FC<GroupedPicklistItemsProps> = ({
  listId,
  onItemPress,
  onItemDelete,
  onNotePress,
}) => {
  const { colors } = useTheme();
  const { picklists } = usePicklistStore();
  const { categories } = useCategoryStore();
  const { products } = useFrequentProductStore();
  const currentList = picklists.find((list) => list.id === listId);
  const [imageUris, setImageUris] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const sortedItems = useMemo<ItemGroup[]>(() => {
    if (!currentList) return [];

    const {
      items,
      sortBy = 'category',
      sortDirection = 'asc',
      groupByCategory = true,
    } = currentList;

    if (groupByCategory && sortBy === 'category') {
      return groupAndSortByCategory(items, categories, sortDirection);
    }

    switch (sortBy) {
      case 'category':
        return [
          { items: sortByCategory(items, categories, sortDirection) },
        ] as ItemGroup[];
      case 'priority':
        return [{ items: sortByPriority(items, sortDirection) }] as ItemGroup[];
      case 'name':
        return [{ items: sortByName(items, sortDirection) }] as ItemGroup[];
      case 'created':
        return [{ items: sortByCreated(items, sortDirection) }] as ItemGroup[];
      default:
        return [{ items }] as ItemGroup[];
    }
  }, [currentList, categories]);

  const loadImageUri = useCallback(async (imageKey: string) => {
    try {
      const uri = await imageUtils.loadImage(imageKey);
      if (uri) {
        setImageUris((prev) => ({ ...prev, [imageKey]: uri }));
      }
    } catch (error) {
      console.error('Failed to load image:', error);
    }
  }, []);

  if (!currentList) return null;

  const getProductImageUrl = (item: PicklistItem) => {
    const product = products.find((p) => p.id === item.productId);
    return product?.imageUrl;
  };

  const renderItem = (item: PicklistItem) => {
    const productImageUrl = getProductImageUrl(item);

    return (
      <Pressable
        key={item.id}
        style={[
          styles.itemContainer,
          { borderBottomColor: colors.border.secondary },
        ]}
        onPress={() => onItemPress?.(item)}
      >
        <Ionicons
          name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={item.completed ? colors.accent.primary : colors.text.secondary}
        />

        <View style={styles.itemContentContainer}>
          <View style={styles.itemInfo}>
            <Text
              style={[
                styles.itemName,
                { color: colors.text.primary },
                item.completed && [
                  styles.itemNameCompleted,
                  { color: colors.text.tertiary },
                ],
              ]}
            >
              {item.name}
            </Text>
            <Text
              style={[styles.itemQuantity, { color: colors.text.secondary }]}
            >
              {item.quantity} {item.unit || '個'}
            </Text>
          </View>

          {productImageUrl && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                if (imageUris[productImageUrl]) {
                  setSelectedImage(imageUris[productImageUrl]);
                }
              }}
              style={styles.thumbnailContainer}
            >
              {imageUris[productImageUrl] ? (
                <Image
                  source={{ uri: imageUris[productImageUrl] }}
                  style={styles.thumbnail}
                />
              ) : (
                <View
                  style={[
                    styles.thumbnailPlaceholder,
                    { backgroundColor: colors.background.secondary },
                  ]}
                  onLayout={() => {
                    if (productImageUrl) loadImageUri(productImageUrl);
                  }}
                >
                  <Ionicons
                    name="image-outline"
                    size={16}
                    color={colors.text.tertiary}
                  />
                </View>
              )}
            </Pressable>
          )}
        </View>

        {item.note && onNotePress && (
          <Pressable
            style={styles.noteButton}
            onPress={(e) => {
              e.stopPropagation();
              onNotePress(item);
            }}
            accessibilityLabel="メモを見る"
          >
            <Ionicons
              name="document-text-outline"
              size={20}
              color={colors.accent.primary}
            />
          </Pressable>
        )}

        {onItemDelete && (
          <Pressable
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              onItemDelete(item);
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </Pressable>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {sortedItems.map((group, index) => (
        <View key={group.category?.id || `uncategorized-${index}`}>
          {group.category ? (
            <Text
              style={[
                styles.categoryName,
                {
                  backgroundColor: colors.background.secondary,
                  color: colors.text.secondary,
                  borderBottomColor: colors.border.secondary,
                  borderBottomWidth: 1,
                },
              ]}
            >
              {group.category.name}
            </Text>
          ) : null}
          {group.items.map(renderItem)}
        </View>
      ))}

      <Modal
        visible={!!selectedImage}
        transparent={true}
        onRequestClose={() => setSelectedImage(null)}
        animationType="fade"
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedImage(null)}
        >
          <View style={styles.imageContainer}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  itemContentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemNameCompleted: {
    textDecorationLine: 'line-through',
  },
  itemQuantity: {
    fontSize: 14,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  thumbnailContainer: {
    marginLeft: 8,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  thumbnailPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '90%',
    height: '70%',
    backgroundColor: 'transparent',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  noteButton: {
    padding: 8,
    marginRight: 0,
  },
});
