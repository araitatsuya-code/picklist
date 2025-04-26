import React, { useEffect } from 'react';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { initializeOnboarding } = useOnboardingStore();

  useEffect(() => {
    initializeOnboarding();
  }, [initializeOnboarding]);

  return <>{children}</>;
};
