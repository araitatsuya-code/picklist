import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../hooks/useTheme';

interface OnboardingContextType {
  isFirstLaunch: boolean;
  currentPage: number;
  isCompleted: boolean;
  setCurrentPage: (page: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const value = await AsyncStorage.getItem('@onboarding_state');
      if (value !== null) {
        const { isFirstLaunch: firstLaunch, isCompleted: completed } =
          JSON.parse(value);
        setIsFirstLaunch(firstLaunch);
        setIsCompleted(completed);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(
        '@onboarding_state',
        JSON.stringify({
          isFirstLaunch: false,
          isCompleted: true,
          lastShown: new Date().toISOString(),
        })
      );
      setIsFirstLaunch(false);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.setItem(
        '@onboarding_state',
        JSON.stringify({
          isFirstLaunch: true,
          isCompleted: false,
          lastShown: new Date().toISOString(),
        })
      );
      setIsFirstLaunch(true);
      setIsCompleted(false);
      setCurrentPage(0);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        isFirstLaunch,
        currentPage,
        isCompleted,
        setCurrentPage,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
