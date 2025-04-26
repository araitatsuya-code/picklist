import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useOnboardingStore } from '../../stores/useOnboardingStore';
import OnboardingPager from './OnboardingPager';
import OnboardingControls from './OnboardingControls';

const { width, height } = Dimensions.get('window');

export const OnboardingScreen: React.FC = () => {
  const { colors } = useTheme();
  const { isFirstLaunch, currentPage, setCurrentPage, completeOnboarding } =
    useOnboardingStore();

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

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <OnboardingPager currentPage={currentPage} />
      <OnboardingControls
        currentPage={currentPage}
        totalPages={4}
        onNext={handleNext}
        onSkip={handleSkip}
        onBack={handleBack}
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
