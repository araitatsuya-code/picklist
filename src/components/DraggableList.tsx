import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  Directions,
} from 'react-native-gesture-handler';
import { PicklistItem } from '../stores/usePicklistStore';
import { useEffect, useCallback, useMemo } from 'react';

interface DraggableListProps {
  items: PicklistItem[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  renderItem: (item: PicklistItem, index: number) => React.ReactNode;
}

/**
 * アイテムコンポーネント
 */
function DraggableItem({
  item,
  index,
  positions,
  activeIndex,
  renderItem,
}: {
  item: PicklistItem;
  index: number;
  positions: Animated.SharedValue<number[]>;
  activeIndex: Animated.SharedValue<number | null>;
  renderItem: (item: PicklistItem, index: number) => React.ReactNode;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const position = positions.value[index] ?? index * 60;
    return {
      transform: [{ translateY: withSpring(position) }],
      zIndex: activeIndex.value === index ? 1 : 0,
    };
  });

  return (
    <Animated.View style={[styles.item, animatedStyle]}>
      {renderItem(item, index)}
    </Animated.View>
  );
}

/**
 * ドラッグ&ドロップで並び替え可能なリストコンポーネント
 */
export function DraggableList({
  items,
  onReorder,
  renderItem,
}: DraggableListProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const activeIndex = useSharedValue<number | null>(null);
  const positions = useSharedValue<number[]>(items.map((_, i) => i * 60));

  // メモ化されたアイテムリスト
  const itemsWithKeys = useMemo(
    () =>
      items.map((item, index) => ({
        ...item,
        key: item.id || `item-${index}-${Date.now()}`,
        index,
      })),
    [items]
  );

  const handleReorder = useCallback(
    (from: number, to: number) => {
      if (
        from >= 0 &&
        from < items.length &&
        to >= 0 &&
        to < items.length &&
        from !== to
      ) {
        onReorder(from, to);
      }
    },
    [items.length, onReorder]
  );

  useEffect(() => {
    positions.value = items.map((_, i) => i * 60);
  }, [items.length]);

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      const startIndex = Math.floor(event.y / 60);
      if (startIndex >= 0 && startIndex < items.length) {
        activeIndex.value = startIndex;
      }
    })
    .onUpdate((event) => {
      if (activeIndex.value === null) return;

      const currentIndex = activeIndex.value;
      const newIndex = Math.floor(event.y / 60);

      if (
        newIndex >= 0 &&
        newIndex < items.length &&
        newIndex !== currentIndex
      ) {
        const newPositions = [...positions.value];
        for (let i = 0; i < items.length; i++) {
          if (i === currentIndex) {
            newPositions[i] = newIndex * 60;
          } else if (
            (i >= currentIndex && i <= newIndex) ||
            (i <= currentIndex && i >= newIndex)
          ) {
            newPositions[i] = i < newIndex ? i * 60 : (i + 1) * 60;
          }
        }
        positions.value = newPositions;
        activeIndex.value = newIndex;
      }
    })
    .onEnd(() => {
      if (activeIndex.value !== null) {
        const fromIndex = activeIndex.value;
        const toIndex = Math.floor(positions.value[fromIndex] / 60);

        // runOnJSを使用してJavaScriptスレッドで実行
        runOnJS(handleReorder)(fromIndex, toIndex);

        // アニメーション完了後に位置をリセット
        positions.value = items.map((_, i) => i * 60);
        activeIndex.value = null;
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={styles.container}>
        {itemsWithKeys.map(({ key, index, ...item }) => (
          <DraggableItem
            key={key}
            item={item}
            index={index}
            positions={positions}
            activeIndex={activeIndex}
            renderItem={renderItem}
          />
        ))}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
