import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface OnboardingControlsProps {
  currentPage: number;
  onNext: () => void;
  onSkip: () => void;
}

const OnboardingControls: React.FC<OnboardingControlsProps> = ({
  currentPage,
  onNext,
  onSkip,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.pagination}>
        {[0, 1, 2, 3].map((page) => (
          <View
            key={page}
            style={[
              styles.dot,
              {
                backgroundColor:
                  page === currentPage
                    ? colors.accent.primary
                    : colors.border.primary,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.skipButton]}
          onPress={onSkip}
        >
          <Text style={[styles.buttonText, { color: colors.text.primary }]}>
            スキップ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={onNext}
        >
          <Text style={[styles.buttonText, { color: colors.text.inverse }]}>
            {currentPage === 3 ? '完了' : '次へ'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  skipButton: {
    backgroundColor: 'transparent',
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingControls;
