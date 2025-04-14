import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useOnboarding } from './OnboardingProvider';
import OnboardingPager from './OnboardingPager';
import OnboardingControls from './OnboardingControls';

const { width, height } = Dimensions.get('window');

export const OnboardingScreen: React.FC = () => {
  const { theme } = useTheme();
  const { isFirstLaunch, currentPage, setCurrentPage, completeOnboarding } =
    useOnboarding();

  if (!isFirstLaunch) {
    return null;
  }

  const handleNext = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <OnboardingPager currentPage={currentPage} />
      <OnboardingControls
        currentPage={currentPage}
        onNext={handleNext}
        onSkip={handleSkip}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    zIndex: 1000,
  },
});

export default OnboardingScreen;
