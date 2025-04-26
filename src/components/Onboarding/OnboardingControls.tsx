import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface OnboardingControlsProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}

const OnboardingControls: React.FC<OnboardingControlsProps> = ({
  currentPage,
  totalPages,
  onNext,
  onSkip,
  onBack,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.pagination}>
        {Array.from({ length: totalPages }).map((_, page) => (
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
        <View style={styles.navigationButtons}>
          {currentPage > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={onBack}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={colors.text.primary}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.button,
              styles.nextButton,
              { backgroundColor: colors.accent.primary },
            ]}
            onPress={onNext}
          >
            <Text style={[styles.buttonText, { color: colors.text.inverse }]}>
              {currentPage === totalPages - 1 ? '完了' : '次へ'}
            </Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  skipButton: {
    backgroundColor: 'transparent',
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
  },
  nextButton: {
    // 背景色はコンポーネント内で動的に設定
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingControls;
