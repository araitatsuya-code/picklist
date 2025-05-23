import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
  isFirstLaunch: boolean;
  currentPage: number;
  isCompleted: boolean;
  lastShown?: string;
  setFirstLaunch: (value: boolean) => void;
  setCurrentPage: (page: number) => void;
  completeOnboarding: () => void;
  initializeOnboarding: () => Promise<void>;
}

const ONBOARDING_STORAGE_KEY = '@onboarding_state';

export const useOnboardingStore = create<OnboardingState>((set) => ({
  isFirstLaunch: true,
  currentPage: 0,
  isCompleted: false,
  lastShown: undefined,

  setFirstLaunch: (value: boolean) => set({ isFirstLaunch: value }),

  setCurrentPage: (page: number) => set({ currentPage: page }),

  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify({
          isFirstLaunch: false,
          isCompleted: true,
          lastShown: new Date().toISOString(),
        })
      );
      set({ isCompleted: true, isFirstLaunch: false });
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
    }
  },

  initializeOnboarding: async () => {
    try {
      const storedState = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        if ('isFirstLaunch' in parsedState && 'isCompleted' in parsedState) {
          set({
            isFirstLaunch: !!parsedState.isFirstLaunch,
            isCompleted: !!parsedState.isCompleted,
            lastShown: parsedState.lastShown || undefined,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load onboarding state:', error);
    }
  },
}));
