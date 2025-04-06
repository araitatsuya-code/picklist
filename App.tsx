import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './src/components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <PaperProvider></PaperProvider>
    </ThemeProvider>
  );
}
