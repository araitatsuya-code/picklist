import { Provider as PaperProvider } from 'react-native-paper';
import { Slot } from 'expo-router';

export default function App() {
  return (
    <PaperProvider theme={{}}>
      <Slot />
    </PaperProvider>
  );
}
