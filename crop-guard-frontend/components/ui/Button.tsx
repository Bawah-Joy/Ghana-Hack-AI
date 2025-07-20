
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function Button({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'primary' 
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return [
          styles.button,
          styles.primaryButton,
          (disabled || loading) && styles.disabledButton
        ];
      case 'secondary':
        return [
          styles.button,
          styles.secondaryButton,
          { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' },
          (disabled || loading) && styles.disabledButton
        ];
      case 'outline':
        return [
          styles.button,
          styles.outlineButton,
          { borderColor: isDark ? '#4ade80' : '#22c55e' },
          (disabled || loading) && styles.disabledButton
        ];
      default:
        return styles.button;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return [styles.buttonText, styles.primaryText];
      case 'secondary':
        return [styles.buttonText, { color: isDark ? '#ffffff' : '#000000' }];
      case 'outline':
        return [styles.buttonText, { color: isDark ? '#4ade80' : '#22c55e' }];
      default:
        return styles.buttonText;
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryButton: {
    backgroundColor: '#22c55e', // Green-500
  },
  secondaryButton: {
    // Background set dynamically
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#ffffff',
  },
});