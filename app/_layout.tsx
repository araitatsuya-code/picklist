import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider } from '../src/components/ThemeProvider';
import { OnboardingProvider } from '../src/components/Onboarding/OnboardingProvider';
import OnboardingScreen from '../src/components/Onboarding/OnboardingScreen';

export default function Layout() {
  return (
    <ThemeProvider>
      <OnboardingProvider>
        <PaperProvider>
          <GestureHandlerRootView style={styles.container}>
            <OnboardingScreen />
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(products)/add"
                options={{
                  title: '商品を追加',
                  headerBackTitle: '戻る',
                }}
              />
              <Stack.Screen
                name="(products)/edit"
                options={{
                  title: '商品を編集',
                  headerBackTitle: '戻る',
                }}
              />
              <Stack.Screen
                name="(products)/add-to-list"
                options={{
                  title: '買い物リストに追加',
                  headerBackTitle: '戻る',
                }}
              />
              <Stack.Screen
                name="scanner"
                options={{
                  title: 'バーコードスキャナー',
                }}
              />
            </Stack>
          </GestureHandlerRootView>
        </PaperProvider>
      </OnboardingProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
