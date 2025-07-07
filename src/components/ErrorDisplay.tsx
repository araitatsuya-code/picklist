import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from './ThemeProvider';

interface ErrorDisplayProps {
  message: string;
  visible: boolean;
  type?: 'error' | 'warning' | 'info';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  visible,
  type = 'error',
}) => {
  const { colors } = useThemeContext();

  if (!visible) return null;

  const getIconName = () => {
    switch (type) {
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'alert-circle';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'error':
        return colors.state.error;
      case 'warning':
        return '#FF9500';
      case 'info':
        return colors.accent.primary;
      default:
        return colors.state.error;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getColor() + '15' }]}>
      <Ionicons name={getIconName()} size={20} color={getColor()} />
      <Text style={[styles.message, { color: getColor() }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    gap: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});