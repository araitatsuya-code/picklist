import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './src/components/ThemeProvider';
import { Slot } from 'expo-router';

export default function App() {
  return (
    <ThemeProvider>
      <PaperProvider theme={{}}>
        <Slot />
      </PaperProvider>
    </ThemeProvider>
  );
}
