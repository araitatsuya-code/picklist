import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  Directions,
} from 'react-native-gesture-handler';
import { PicklistItem } from '../stores/usePicklistStore';

interface DraggableListProps {
  items: PicklistItem[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  renderItem: (item: PicklistItem, index: number) => React.ReactNode;
}

/**
 * ドラッグ&ドロップで並び替え可能なリストコンポーネント
 */
export function DraggableList({
  items,
  onReorder,
  renderItem,
}: DraggableListProps) {
  const activeIndex = useSharedValue<number | null>(null);
  const positions = items.map((_, index) => useSharedValue(index * 60)); // 60はアイテムの高さ

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
        // アイテムの位置を更新
        positions.forEach((position, index) => {
          if (index === currentIndex) {
            position.value = withSpring(newIndex * 60);
          } else if (
            (index >= currentIndex && index <= newIndex) ||
            (index <= currentIndex && index >= newIndex)
          ) {
            position.value = withSpring(
              index < newIndex ? index * 60 : (index + 1) * 60
            );
          }
        });

        activeIndex.value = newIndex;
      }
    })
    .onEnd(() => {
      if (activeIndex.value !== null) {
        const fromIndex = items.findIndex(
          (item) => item.order === activeIndex.value
        );
        const toIndex = Math.floor(positions[fromIndex].value / 60);
        onReorder(fromIndex, toIndex);
        activeIndex.value = null;
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={styles.container}>
        {items.map((item, index) => {
          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ translateY: positions[index].value }],
            zIndex: activeIndex.value === index ? 1 : 0,
          }));

          return (
            <Animated.View key={item.id} style={[styles.item, animatedStyle]}>
              {renderItem(item, index)}
            </Animated.View>
          );
        })}
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
