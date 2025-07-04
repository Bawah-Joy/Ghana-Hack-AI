import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';

export default function WelcomeSplashScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    // Auto-navigate to tabs after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#ffffff' }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          {/* Placeholder for logo - replace with your actual logo */}
          <View style={[styles.logoPlaceholder, { backgroundColor: '#22c55e' }]}>
            <Text style={styles.logoText}>CG</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.appName, { color: isDark ? '#ffffff' : '#111827' }]}>
            Crop Guard
          </Text>
          <Text style={[styles.welcomeText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Welcome! 👋
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Helping farmers detect crop diseases at the earlier stage
          </Text>
        </View>

        <View style={styles.loadingContainer}>
          <View style={[styles.loadingBar, { backgroundColor: isDark ? '#374151' : '#f3f4f6' }]}>
            <View style={[styles.loadingProgress, { backgroundColor: '#22c55e' }]} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  loadingContainer: {
    width: '100%',
    maxWidth: 200,
  },
  loadingBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    width: '70%',
    height: '100%',
    borderRadius: 2,
  },
});