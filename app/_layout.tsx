import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function Layout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Picklist',
          }}
        />
        <Stack.Screen
          name="list/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="scanner"
          options={{
            title: 'バーコードスキャナー',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: '設定',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
